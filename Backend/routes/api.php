<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CooperativeController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AdminController;


/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

// Home
Route::get('/home', [ProductController::class, 'home']);

// Catalogue
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}/products', [
    CategoryController::class,
    'products'
]);

// Public cooperatives / shops
Route::get('/cooperatives', [CooperativeController::class, 'index']);

Route::get('/cooperatives/{cooperative}', [
    CooperativeController::class,
    'show'
]);

Route::get('/cooperatives/{cooperative}/products', [
    CooperativeController::class,
    'products'
]);


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    Route::post('/login', [
        AuthController::class,
        'login'
    ]);

    Route::post('/register/buyer', [
        AuthController::class,
        'registerBuyer'
    ]);

    Route::post('/register/cooperative', [
        AuthController::class,
        'registerCooperative'
    ]);
});


/*
|--------------------------------------------------------------------------
| Authenticated users
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    | Authentication
    */

    Route::get('/auth/me', [
        AuthController::class,
        'me'
    ]);

    Route::post('/auth/logout', [
        AuthController::class,
        'logout'
    ]);


    /*
    | Profile
    */

    Route::get('/profile', [
        ProfileController::class,
        'show'
    ]);

    Route::put('/profile', [
        ProfileController::class,
        'update'
    ]);


    /*
    | Cart
    */

    Route::get('/cart', [
        CartController::class,
        'show'
    ]);

    Route::post('/cart/items', [
        CartController::class,
        'addItem'
    ]);

    Route::put('/cart/items/{item}', [
        CartController::class,
        'updateItem'
    ]);

    Route::delete('/cart/items/{item}', [
        CartController::class,
        'removeItem'
    ]);

    Route::delete('/cart', [
        CartController::class,
        'clear'
    ]);


    /*
    | Orders
    */

    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    Route::get('/my/orders', [
        OrderController::class,
        'myOrders'
    ]);

    Route::get('/my/orders/{order}', [
        OrderController::class,
        'show'
    ]);

    Route::get('/my/orders/{order}/confirmation', [
        OrderController::class,
        'confirmation'
    ]);


    /*
    | Reviews
    */

    Route::post('/products/{product}/reviews', [
        ReviewController::class,
        'store'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Cooperative
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:cooperative')
        ->prefix('cooperative')
        ->group(function () {

            // Dashboard
            Route::get('/dashboard', [
                CooperativeController::class,
                'dashboard'
            ]);

            // My shop
            Route::get('/shop', [
                CooperativeController::class,
                'myShop'
            ]);

            Route::put('/shop', [
                CooperativeController::class,
                'updateShop'
            ]);

            // My products
            Route::get('/products', [
                ProductController::class,
                'myProducts'
            ]);

            Route::post('/products', [
                ProductController::class,
                'store'
            ]);

            Route::get('/products/{product}', [
                ProductController::class,
                'edit'
            ]);

            Route::put('/products/{product}', [
                ProductController::class,
                'update'
            ]);

            Route::delete('/products/{product}', [
                ProductController::class,
                'destroy'
            ]);

            // Orders received
            Route::get('/orders', [
                OrderController::class,
                'cooperativeOrders'
            ]);

            Route::get('/orders/{order}', [
                OrderController::class,
                'cooperativeOrder'
            ]);

            Route::put('/orders/{order}/status', [
                OrderController::class,
                'updateStatus'
            ]);
        });


    /*
    |--------------------------------------------------------------------------
    | Admin
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')
        ->prefix('admin')
        ->group(function () {

            // Dashboard
            Route::get('/dashboard', [
                AdminController::class,
                'dashboard'
            ]);

            // Cooperatives
            Route::get('/cooperatives', [
                CooperativeController::class,
                'adminIndex'
            ]);

            Route::get('/cooperatives/{cooperative}', [
                CooperativeController::class,
                'adminShow'
            ]);

            Route::put('/cooperatives/{cooperative}/status', [
                CooperativeController::class,
                'updateStatus'
            ]);

            // Reviews
            Route::get('/reviews', [
                ReviewController::class,
                'adminIndex'
            ]);

            Route::put('/reviews/{review}/status', [
                ReviewController::class,
                'updateStatus'
            ]);

            // Categories
            Route::get('/categories', [
                CategoryController::class,
                'adminIndex'
            ]);

            Route::post('/categories', [
                CategoryController::class,
                'store'
            ]);

            Route::put('/categories/{category}', [
                CategoryController::class,
                'update'
            ]);

            Route::delete('/categories/{category}', [
                CategoryController::class,
                'destroy'
            ]);
        });
});