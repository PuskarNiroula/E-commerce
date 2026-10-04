<?php

use App\Http\ApiController\Authentication\AuthenticationApiController;
use App\Http\ApiController\StoreAdmin\SubscriptionController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\JwtAuthenticationMiddleware;
use Illuminate\Support\Facades\Route;



    Route::controller(AuthenticationApiController::class)->group(function () {
        Route::post('business/register','registerShop')->name('business.register');
        Route::post('/login','login')->name('api.login');
});

    Route::middleware(JwtAuthenticationMiddleware::class)->group(function () {

        Route::middleware(AdminMiddleware::class)->group(function () {
            Route::prefix('admin')->group(function () {
                Route::controller(SubscriptionController::class)->group(function () {
                    Route::get('/get-my-plan','showMyCurrentPlan')->name('api.subscription.get-my-plan');
                    Route::get('/plans','showAvailableSubscriptions')->name('api.subscription.show');
                });
            });
        });




    });

