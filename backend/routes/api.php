<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\ReferralController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio/{id}', [PortfolioController::class, 'show']);

Route::get('/classes', [ClassController::class, 'index']);
Route::get('/classes/{id}', [ClassController::class, 'show']);

Route::post('/contact', [ContactController::class, 'store']);

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/videos', [VideoController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    Route::get('/rewards', [RewardController::class, 'index']);
    Route::get('/rewards/total', [RewardController::class, 'total']);

    Route::post('/referrals', [ReferralController::class, 'store']);
    Route::get('/referrals', [ReferralController::class, 'index']);
});
