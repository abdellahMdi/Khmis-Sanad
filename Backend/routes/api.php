<?php

use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\ShopController as AdminShopController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\ShopOrderController;
use App\Http\Controllers\Api\ShopProductController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::middleware('role:client')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/items', [CartController::class, 'storeItem']);
        Route::patch('/cart/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{item}', [CartController::class, 'destroyItem']);

        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{command}', [OrderController::class, 'show']);

        Route::post('/reviews', [ReviewController::class, 'store']);
    });

    Route::middleware('role:artisan')->group(function () {
        Route::get('/shop', [ShopController::class, 'show']);
        Route::post('/shop/proof', [ShopController::class, 'uploadProof']);
    });

    Route::middleware(['role:artisan', 'artisan.not_blocked'])->group(function () {
        Route::put('/shop', [ShopController::class, 'update']);

        Route::get('/shop/products', [ShopProductController::class, 'index']);
        Route::get('/shop/products/{product}', [ShopProductController::class, 'show']);
        Route::post('/shop/products', [ShopProductController::class, 'store']);
        Route::put('/shop/products/{product}', [ShopProductController::class, 'update']);
        Route::delete('/shop/products/{product}', [ShopProductController::class, 'destroy']);

        Route::get('/shop/orders', [ShopOrderController::class, 'index']);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/shops', [AdminShopController::class, 'index']);
        Route::patch('/shops/{shop}/approve', [AdminShopController::class, 'approve']);
        Route::patch('/shops/{shop}/block', [AdminShopController::class, 'block']);

        Route::get('/reviews/pending', [AdminReviewController::class, 'pending']);
        Route::patch('/reviews/{review}/approve', [AdminReviewController::class, 'approve']);
        Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);

        Route::get('/users', [AdminUserController::class, 'index']);
    });
});
