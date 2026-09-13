<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;
use Shop\Repository\ShopRepository;
use Shop\RepositoryInterface\ShopRepositoryInterface;
use User\Repository\UserRepository;
use User\RepositoryInterface\UserRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        App::bind(UserRepositoryInterface::class,UserRepository::class);
        App::bind(ShopRepositoryInterface::class,ShopRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
