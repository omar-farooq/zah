<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaintenanceRequestRequest;
use App\Http\Requests\UpdateMaintenanceRequestRequest;
use App\Models\MaintenanceRequest;

class MaintenanceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreMaintenanceRequestRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMaintenanceRequestRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MaintenanceRequest  $maintenanceRequest
     * @return \Illuminate\Http\Response
     */
    public function show(MaintenanceRequest $maintenanceRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MaintenanceRequest  $maintenanceRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(MaintenanceRequest $maintenanceRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMaintenanceRequestRequest  $request
     * @param  \App\Models\MaintenanceRequest  $maintenanceRequest
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMaintenanceRequestRequest $request, MaintenanceRequest $maintenanceRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MaintenanceRequest  $maintenanceRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(MaintenanceRequest $maintenanceRequest)
    {
        //
    }
}
