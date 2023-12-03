<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingAgendaController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\MinuteController;
use App\Http\Controllers\NextOfKinController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\RecurringPaymentController;
use App\Http\Controllers\RentController;
use App\Http\Controllers\RoleAssignmentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RuleChangeController;
use App\Http\Controllers\RuleController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SecretaryReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TenancyController;
use App\Http\Controllers\TreasuryReportController;
use App\Http\Controllers\TreasuryPlanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoteController;
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

Route::get('/', function() {
    return redirect('/dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'title' => 'Dashboard'
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/generate-contact-form-email', [JobController::class, 'generateEmail'])->middleware(['throttle:contact-form-submission']);
Route::post('/meetings/register-attendance', [MeetingController::class, 'registerAttendance']);
Route::post('/meetings/register-guests', [MeetingController::class, 'registerGuest']);

//Comments
Route::get('/purchase-requests/{purchaseRequest}/comments', function (PurchaseRequest $purchaseRequest) {
    return $purchaseRequest->comments()->paginate(5);
});

Route::get('/maintenance-requests/{maintenanceRequest}/comments', function (MaintenanceRequest $maintenanceRequest) {
    return $maintenanceRequest->comments()->paginate(5);
});

//Members Only
Route::middleware(['member', 'auth'])->group(function() {
    //Stats pages
    Route::get('/treasury', [TreasuryReportController::class, 'summary'])->name('treasury.summary');

    //Treasurable model
    Route::get('/treasurable/{id}', [TreasuryReportController::class, 'treasurableModel']);

    //Latest Treasury Plan
    Route::get('/treasury-plans/latest', [TreasuryPlanController::class, 'latest'])->name('treasury-plans.latest');

    //Update Model Approval
    Route::patch('/update-approval-status', [ApprovalController::class, 'updateModelApproval']);

    Route::resource('accounts', AccountController::class);
    Route::resource('approval', ApprovalController::class);
    Route::resource('memberships', MembershipController::class);
    Route::resource('receipts', ReceiptController::class);
    Route::resource('recurring-payments', RecurringPaymentController::class);
    Route::resource('rents', RentController::class);
    Route::resource('role-assignment', RoleAssignmentController::class);
    Route::resource('rule-change', RuleChangeController::class);
    Route::resource('settings', SettingsController::class)->parameters([
        'settings' => 'settings:name'
    ]);
    Route::resource('treasury-plans', TreasuryPlanController::class);
    Route::resource('treasury-reports', TreasuryReportController::class);
    Route::resource('users', UserController::class);

    //Schedule
    Route::controller(ScheduleController::class)->group(function() {
        Route::get('/meetings/schedule', 'browse')->name('schedule');	
        Route::post('/meetings/schedule/suggestions/add', 'addSuggestion');
        Route::post('/meetings/schedule/suggestions/delete', 'removeSuggestion');
        Route::put('/meetings/schedule/availability/update', 'updateAvailability');
    });
});

//View upcoming maintenance
Route::get('/maintenance/upcoming', [MaintenanceController::class, 'upcoming'])->middleware(['auth'])->name('maintenance.upcoming');

//Requires user to be signed in
Route::middleware(['auth'])->group(function() {
    Route::resource('agenda', MeetingAgendaController::class);
    Route::resource('comments', CommentController::class);
    Route::resource('maintenance', MaintenanceController::class);
    Route::resource('maintenance-requests', MaintenanceRequestController::class);
    Route::resource('meetings', MeetingController::class);
    Route::resource('minutes', MinuteController::class);
    Route::resource('nextOfKin', NextOfKinController::class);
    Route::resource('payments', PaymentController::class);
    Route::resource('poll', PollController::class);
    Route::resource('purchases', PurchaseController::class);
    Route::resource('purchase-requests', PurchaseRequestController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('rules', RuleController::class);
    Route::resource('secretary-reports', SecretaryReportController::class);
    Route::resource('tasks', TaskController::class);
    Route::resource('tenants', TenancyController::class);
    Route::resource('vote', VoteController::class);

});

require __DIR__.'/auth.php';
