<?php

namespace App\Providers;

use App\Models\Token;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\SanctumServiceProvider as ServiceProvider;

class SanctumServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        parent::register();
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        Sanctum::usePersonalAccessTokenModel(Token::class);
    }
}
