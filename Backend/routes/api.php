<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    

    });
    Route::middleware(['auth:sanctum', 'role:cooperative'])->prefix('cooperative')->group(function () {


    });
});
