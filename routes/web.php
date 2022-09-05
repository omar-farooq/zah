<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\ScheduleController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::controller(MeetingController::class)->group(function() {
	Route::post('/meetings/create', 'store');	
});

Route::controller(ScheduleController::class)->group(function() {
	Route::get('/meetings/schedule', 'browse');	
	Route::post('/meetings/schedule/suggestions/add', 'addSuggestion');
	Route::post('/meetings/schedule/suggestions/delete', 'removeSuggestion');
	Route::post('/meetings/schedule/availability/add', 'addAvailability');
});

require __DIR__.'/auth.php';
