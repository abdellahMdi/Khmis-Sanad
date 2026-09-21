<?php

namespace App\Providers;

use App\Models\Avis;
use App\Models\Command;
use App\Models\Cooperative;
use App\Models\PanierItem;
use App\Models\Product;
use App\Notifications\Channels\DatabaseChannel;
use App\Policies\AvisPolicy;
use App\Policies\CooperativePolicy;
use App\Policies\ProductPolicy;
use Illuminate\Notifications\Channels\DatabaseChannel as LaravelDatabaseChannel;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LaravelDatabaseChannel::class, DatabaseChannel::class);
    }

    public function boot(): void
    {
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Cooperative::class, CooperativePolicy::class);
        Gate::policy(Avis::class, AvisPolicy::class);

        Route::bind('item', fn (string $value) => PanierItem::query()->findOrFail($value));
        Route::bind('review', fn (string $value) => Avis::query()->findOrFail($value));
        Route::bind('shop', fn (string $value) => Cooperative::query()->findOrFail($value));
        Route::bind('command', fn (string $value) => Command::query()->findOrFail($value));
    }
}
