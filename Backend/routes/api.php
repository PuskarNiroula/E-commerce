<?php

use App\Http\ApiController\Authentication\AuthenticationApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

    Route::controller(AuthenticationApiController::class)->group(function () {
        Route::post('business/register','registerShop')->name('business.register');
});

