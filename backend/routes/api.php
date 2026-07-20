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
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\NegotiationController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\PortfolioController as AdminPortfolioController;
use App\Http\Controllers\Admin\ClassController as AdminClassController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\VideoController as AdminVideoController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\ShopCategoryController as AdminShopCategoryController;
use App\Http\Controllers\Admin\ShopItemController as AdminShopItemController;
use App\Http\Controllers\Admin\NegotiationController as AdminNegotiationController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
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
Route::get('/testimonials/stats', [TestimonialController::class, 'stats']);
Route::post('/testimonials', [TestimonialController::class, 'store']);

Route::get('/videos', [VideoController::class, 'index']);
Route::post('/videos', [VideoController::class, 'store']);

Route::get('/shop/categories', [ShopController::class, 'categories']);
Route::get('/shop/items', [ShopController::class, 'items']);
Route::get('/shop/items/{id}', [ShopController::class, 'show']);

Route::post('/shop/cart/add', [CartController::class, 'add']);
Route::get('/shop/cart', [CartController::class, 'index']);
Route::patch('/shop/cart/{id}', [CartController::class, 'update']);
Route::delete('/shop/cart/{id}', [CartController::class, 'remove']);
Route::delete('/shop/cart', [CartController::class, 'clear']);

Route::post('/shop/negotiate', [NegotiationController::class, 'store']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // Rewards
    Route::get('/rewards', [RewardController::class, 'index']);
    Route::get('/rewards/total', [RewardController::class, 'total']);

    // Referrals
    Route::get('/referrals', [ReferralController::class, 'index']);
    Route::post('/referrals', [ReferralController::class, 'store']);

    // Transactions / Wallet
    Route::get('/transactions', [TransactionController::class, 'index']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);

    // Coupons
    Route::get('/coupons', [CouponController::class, 'index']);
});

// Admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);

        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // Services
        Route::get('/services', [AdminServiceController::class, 'index']);
        Route::post('/services', [AdminServiceController::class, 'store']);
        Route::get('/services/{id}', [AdminServiceController::class, 'show']);
        Route::put('/services/{id}', [AdminServiceController::class, 'update']);
        Route::delete('/services/{id}', [AdminServiceController::class, 'destroy']);

        // Portfolio
        Route::get('/portfolio', [AdminPortfolioController::class, 'index']);
        Route::post('/portfolio', [AdminPortfolioController::class, 'store']);
        Route::get('/portfolio/{id}', [AdminPortfolioController::class, 'show']);
        Route::put('/portfolio/{id}', [AdminPortfolioController::class, 'update']);
        Route::delete('/portfolio/{id}', [AdminPortfolioController::class, 'destroy']);

        // Classes
        Route::get('/classes', [AdminClassController::class, 'index']);
        Route::post('/classes', [AdminClassController::class, 'store']);
        Route::get('/classes/{id}', [AdminClassController::class, 'show']);
        Route::put('/classes/{id}', [AdminClassController::class, 'update']);
        Route::delete('/classes/{id}', [AdminClassController::class, 'destroy']);

        // Bookings
        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
        Route::put('/bookings/{id}', [AdminBookingController::class, 'update']);
        Route::delete('/bookings/{id}', [AdminBookingController::class, 'destroy']);

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}', [AdminOrderController::class, 'update']);
        Route::delete('/orders/{id}', [AdminOrderController::class, 'destroy']);

        // Newsletter
        Route::get('/newsletter/subscribers', [AdminNewsletterController::class, 'subscribers']);
        Route::post('/newsletter/send', [AdminNewsletterController::class, 'send']);
        Route::delete('/newsletter/subscribers/{id}', [AdminNewsletterController::class, 'destroy']);

        // Coupons / Promotions
        Route::get('/coupons', [AdminCouponController::class, 'index']);
        Route::post('/coupons', [AdminCouponController::class, 'store']);
        Route::get('/coupons/{id}', [AdminCouponController::class, 'show']);
        Route::put('/coupons/{id}', [AdminCouponController::class, 'update']);
        Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy']);

        // Messages
        Route::get('/messages', [AdminMessageController::class, 'index']);
        Route::get('/messages/{id}', [AdminMessageController::class, 'show']);
        Route::delete('/messages/{id}', [AdminMessageController::class, 'destroy']);

        // Testimonials
        Route::get('/testimonials', [AdminTestimonialController::class, 'index']);
        Route::post('/testimonials', [AdminTestimonialController::class, 'store']);
        Route::get('/testimonials/{id}', [AdminTestimonialController::class, 'show']);
        Route::put('/testimonials/{id}', [AdminTestimonialController::class, 'update']);
        Route::delete('/testimonials/{id}', [AdminTestimonialController::class, 'destroy']);

        // Videos
        Route::get('/videos', [AdminVideoController::class, 'index']);
        Route::put('/videos/{id}', [AdminVideoController::class, 'update']);
        Route::delete('/videos/{id}', [AdminVideoController::class, 'destroy']);

        // Shop Categories
        Route::get('/shop/categories', [AdminShopCategoryController::class, 'index']);
        Route::post('/shop/categories', [AdminShopCategoryController::class, 'store']);
        Route::get('/shop/categories/{id}', [AdminShopCategoryController::class, 'show']);
        Route::post('/shop/categories/{id}', [AdminShopCategoryController::class, 'update']);
        Route::delete('/shop/categories/{id}', [AdminShopCategoryController::class, 'destroy']);

        // Shop Items
        Route::get('/shop/items', [AdminShopItemController::class, 'index']);
        Route::post('/shop/items', [AdminShopItemController::class, 'store']);
        Route::get('/shop/items/{id}', [AdminShopItemController::class, 'show']);
        Route::post('/shop/items/{id}', [AdminShopItemController::class, 'update']);
        Route::delete('/shop/items/{id}', [AdminShopItemController::class, 'destroy']);

        // Negotiations
        Route::get('/shop/negotiations', [AdminNegotiationController::class, 'index']);
        Route::put('/shop/negotiations/{id}', [AdminNegotiationController::class, 'respond']);

        // Settings / Referral config
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // Broadcast Notifications
        Route::post('/notifications/send-all', [AdminNotificationController::class, 'sendToAll']);
        Route::post('/notifications/send-user', [AdminNotificationController::class, 'sendToUser']);
    });
});
