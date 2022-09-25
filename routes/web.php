<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingAgendaController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\MinuteController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TenancyController;
use App\Http\Controllers\UserController;
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

/*Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
 */

Route::get('/', function() {
    return redirect('/login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::controller(MeetingController::class)->group(function() {
    Route::post('/meetings/create', 'create');
    Route::get('/meetings/new', 'store');    
});

Route::controller(ScheduleController::class)->group(function() {
	Route::get('/meetings/schedule', 'browse');	
	Route::post('/meetings/schedule/suggestions/add', 'addSuggestion');
	Route::post('/meetings/schedule/suggestions/delete', 'removeSuggestion');
	Route::post('/meetings/schedule/availability/add', 'addAvailability');
	Route::put('/meetings/schedule/availability/update/{id}', 'updateAvailability');
});

Route::resource('approval', ApprovalController::class);
Route::resource('agenda', MeetingAgendaController::class);
Route::resource('memberships', MembershipController::class);
Route::resource('minutes', MinuteController::class);
Route::resource('purchase-requests', PurchaseRequestController::class);
Route::resource('tasks', TaskController::class);
Route::resource('tenants', TenancyController::class);
Route::resource('users', UserController::class);

require __DIR__.'/auth.php';
