<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Maintenance $maintenance, Request $request)
    {
        if(isset($request->table)) {

            if($request->table == 'needAction') {
                return response()->json(
                    $maintenance->where('paid', '0')->orderBy('created_at', 'desc')->paginate(10),
                );
            }

            if($request->table == 'paid') {
                return response()->json(
                    $maintenance->where('paid', '1')->orderBy('created_at', 'desc')->paginate(10),
                );
            }
        } else {
            return Inertia::render('Maintenance/Browse', [
                'title' => 'All Maintenance'
            ]);
        }
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
     * @param  \App\Http\Requests\StoreMaintenanceRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store($maintenance_request_id)
    {
        $maintenanceRequest = MaintenanceRequest::find($maintenance_request_id);

        Maintenance::create([
            'maintenance_request_id' => $maintenance_request_id,
            'final_cost' => $maintenanceRequest->cost,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Maintenance  $maintenance
     * @return \Illuminate\Http\Response
     */
    public function show(Maintenance $maintenance)
    {
        return Inertia::render('Maintenance/ViewMaintenance', [
            'titile' => 'Maintenance History',
            'maintenance' => $maintenance
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Maintenance  $maintenance
     * @return \Illuminate\Http\Response
     */
    public function edit(Maintenance $maintenance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMaintenanceRequest  $request
     * @param  \App\Models\Maintenance  $maintenance
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Maintenance $maintenance)
    {
        $maintenance->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Maintenance  $maintenance
     * @return \Illuminate\Http\Response
     */
    public function destroy(Maintenance $maintenance)
    {
        //
    }
}
