<?php

use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Event routes
Route::middleware('auth:sanctum')->group(function () {
    // Routes accessible to users with 'manage events' permission
    Route::middleware('permission:manage events')->group(function () {
        Route::apiResource('events', EventController::class);
    });

    // Public event routes (read-only for authenticated users)
    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{event}', [EventController::class, 'show']);

    // Role and Permission routes (accessible to users with 'manage roles' permission)
    Route::middleware('permission:manage roles')->group(function () {
        // Role routes
        Route::apiResource('roles', RoleController::class);
        Route::post('roles/assign', [RoleController::class, 'assignRoleToUser']);
        Route::post('roles/remove', [RoleController::class, 'removeRoleFromUser']);

        // Permission routes
        Route::apiResource('permissions', PermissionController::class);
        Route::post('permissions/assign', [PermissionController::class, 'assignPermissionToRole']);
        Route::post('permissions/remove', [PermissionController::class, 'removePermissionFromRole']);
    });
});

// Public event routes (no authentication required)
Route::get('public/events', [EventController::class, 'index']);
Route::get('public/events/{event}', [EventController::class, 'show']);
