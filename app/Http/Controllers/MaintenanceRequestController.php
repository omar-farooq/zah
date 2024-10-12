<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaintenanceRequestRequest;
use App\Http\Requests\UpdateMaintenanceRequestRequest;
use App\Models\MaintenanceRequest;
use Auth;
use Inertia\Inertia;
use Redirect;

class MaintenanceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(MaintenanceRequest $maintenanceRequest)
    {
        return Inertia::render('MaintenanceRequests/Browse', [
            'title' => 'Maintenance Requests - Need Approval',
            'maintenanceRequests' => $maintenanceRequest->orderBy('created_at', 'desc')->paginate(10),
            'unapprovedRequests' => $maintenanceRequest->notYetApproved(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Maintenance/RequestForm', [
            'title' => 'Request Maintenance',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMaintenanceRequestRequest $request)
    {
        $new_maintenance_request = Auth::User()->maintenanceRequests()->create($request->all());

        if ($request->emergency === true) {
            $subject = 'Emergency Maintenance requested';
            $messageBody = '<p>'.$request->required_maintenance.' has been requested for the following reason:</p><p>'.$request->reason.'</p><p> please <a href="'.env('APP_URL').'/maintenance-requests/'.$new_maintenance_request->id.'">click here</a> and review the request as soon as possible.</p>';

            app(JobController::class)->notificationEmail($subject, $messageBody);
        }

        return Redirect::route('maintenance-requests.show', $new_maintenance_request);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(MaintenanceRequest $maintenanceRequest)
    {
        return Inertia::render('Maintenance/ViewMaintenanceRequest', [
            'maintenanceRequest' => $maintenanceRequest,
            'title' => 'Maintenance Request for '.$maintenanceRequest->required_maintenance,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(MaintenanceRequest $maintenanceRequest)
    {
        return Inertia::render('MaintenanceRequests/Edit', [
            'maintenanceRequest' => $maintenanceRequest,
            'title' => 'Edit Maintenance Request',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMaintenanceRequestRequest $request, MaintenanceRequest $maintenanceRequest)
    {
        $maintenanceRequest->update($request->all());

        return to_route('maintenance-requests.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(MaintenanceRequest $maintenanceRequest)
    {
        //
    }
}
