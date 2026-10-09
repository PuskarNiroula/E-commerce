<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;
use ReflectionException;
use Shop\Repository\ShopRepository;
use Shop\RepositoryInterface\ShopRepositoryInterface;
use Subscription\Repository\SubscriptionPlanRepo;
use Subscription\RepositoryInterface\SubscriptionPlanRepoInterface;
use User\Repository\UserRepository;
use User\RepositoryInterface\UserRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * @throws ReflectionException
     */
    public function register(): void
    {
        App::bind(UserRepositoryInterface::class,UserRepository::class);
        App::bind(ShopRepositoryInterface::class,ShopRepository::class);
        App::bind(SubscriptionPlanRepoInterface::class,SubscriptionPlanRepo::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
