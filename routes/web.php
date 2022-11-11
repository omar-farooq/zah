<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingAgendaController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\MinuteController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\RoleAssignmentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SecretaryReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TenancyController;
use App\Http\Controllers\UserController;
use App\Models\PurchaseRequest;
use App\Models\MaintenanceRequest;
use App\Models\Meeting;
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

Route::controller(ScheduleController::class)->group(function() {
	Route::get('/meetings/schedule', 'browse');	
	Route::post('/meetings/schedule/suggestions/add', 'addSuggestion');
	Route::post('/meetings/schedule/suggestions/delete', 'removeSuggestion');
	Route::put('/meetings/schedule/availability/update', 'updateAvailability');
});

Route::post('/meetings/register-attendance', [MeetingController::class, 'markAttendance']);

//Comments
Route::get('/purchase-requests/{purchaseRequest}/comments', function (PurchaseRequest $purchaseRequest) {
    return $purchaseRequest->comments()->paginate(5);
});

Route::get('/maintenance-requests/{maintenanceRequest}/comments', function (MaintenanceRequest $maintenanceRequest) {
    return $maintenanceRequest->comments()->paginate(5);
});

Route::resource('approval', ApprovalController::class);
Route::resource('agenda', MeetingAgendaController::class);
Route::resource('comments', CommentController::class);
Route::resource('maintenance-requests', MaintenanceRequestController::class);
Route::resource('meetings', MeetingController::class);
Route::resource('memberships', MembershipController::class);
Route::resource('minutes', MinuteController::class);
Route::resource('purchase-requests', PurchaseRequestController::class);
Route::resource('role-assignment', RoleAssignmentController::class);
Route::resource('roles', RoleController::class);
Route::resource('secretary-reports', SecretaryReportController::class);
Route::resource('tasks', TaskController::class);
Route::resource('tenants', TenancyController::class);
Route::resource('users', UserController::class);

require __DIR__.'/auth.php';
