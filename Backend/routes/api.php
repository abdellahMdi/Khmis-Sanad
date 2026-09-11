<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CooperativeController;
use App\Http\Controllers\Api\CommandController;
use App\Http\Controllers\Api\PanierController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|---------------------------------------------------------------------------------------------
| Marketplace Artisanale — API Routes
|---------------------------------------------------------------------------------------------
|
| Auth : Laravel Sanctum (SPA stateful tokens)
| Roles: admin | artisan | client   (enforced via EnsureRole middleware)
|
*/

// ── Public routes ────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::get('/categories',              [CategoryController::class, 'index']);
Route::get('/cooperatives',            [CooperativeController::class, 'index']);
Route::get('/cooperatives/{cooperative}', [CooperativeController::class, 'show']);
Route::get('/products',                [ProductController::class, 'index']);
Route::get('/products/{product}',      [ProductController::class, 'show']);
Route::get('/products/{product}/avis', [AvisController::class, 'index']);

// ── Authenticated routes ──────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Cart (client)
    Route::prefix('panier')->middleware('role:client')->group(function () {
        Route::get('/',              [PanierController::class, 'show']);
        Route::post('/items',        [PanierController::class, 'addItem']);
        Route::delete('/items/{item}', [PanierController::class, 'removeItem']);
        Route::delete('/clear',      [PanierController::class, 'clear']);
    });

    // Orders (client)
    Route::prefix('commands')->middleware('role:client')->group(function () {
        Route::get('/',            [CommandController::class, 'index']);
        Route::post('/',           [CommandController::class, 'store']);
        Route::get('/{command}',   [CommandController::class, 'show']);
    });

    // Reviews (client)
    Route::post('/products/{product}/avis', [AvisController::class, 'store'])
        ->middleware('role:client');

    // Cooperative management (artisan)
    Route::prefix('cooperative')->middleware('role:artisan')->group(function () {
        Route::post('/',   [CooperativeController::class, 'store']);
        Route::patch('/',  [CooperativeController::class, 'update']);
    });

    // Product management (artisan)
    Route::middleware('role:artisan')->group(function () {
        Route::post('/products',           [ProductController::class, 'store']);
        Route::patch('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });

    // ── Admin ─────────────────────────────────────────────────────────────────
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/users',                           [AdminController::class, 'users']);
        Route::get('/cooperatives',                    [AdminController::class, 'cooperatives']);
        Route::patch('/cooperatives/{cooperative}/status', [AdminController::class, 'setCoopStatus']);
        Route::patch('/commands/{command}/status',     [CommandController::class, 'updateStatus']);
        Route::patch('/avis/{avis}/moderate',          [AvisController::class, 'moderate']);
        Route::post('/categories',                     [CategoryController::class, 'store']);
        Route::delete('/categories/{category}',        [CategoryController::class, 'destroy']);
    });
});
