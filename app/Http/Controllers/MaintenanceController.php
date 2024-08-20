<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\MaintenanceRequest;
use App\Services\TreasuryService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{

    /**
     * Instantiate Treasury Service
     *
     */
    public function __construct() {
        $this->treasuryService = new TreasuryService;
    }

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
                $searchTerm = $request->search;
                return response()->json(
                    $maintenance->where('paid', '1')
                                ->whereHas('maintenanceRequest', function($query) use ($searchTerm) {
                                    return $query->where('required_maintenance', 'like', '%'.$searchTerm.'%');
                                })
                                ->orderBy('created_at', 'desc')
                                ->paginate(10),
                );
            }
        } else {
            return Inertia::render('Maintenance/Browse', [
                'title' => 'All Maintenance'
            ]);
        }
    }

    /**
     * Display upcoming maintenance
     *
     * @return \Illuminate\Http\Response
     */
    public function upcoming(Maintenance $maintenance)
    {
        return Inertia::render('Maintenance/Upcoming', [
            'title' => 'Upcoming Maintenance',
            'maintenance' => $maintenance->whereHas('maintenanceRequest', function($query) {
                return $query->where('end_date', '>=', Carbon::now('Europe/London'));
            })->get()
        ]);
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

        $maintenance = Maintenance::create([
            'maintenance_request_id' => $maintenance_request_id,
            'final_cost' => $maintenanceRequest->cost,
        ]);

        //Send email to notify people about the maintenance
        $maintenance_start_date = Carbon::parse($maintenanceRequest->start_date)->setTimezone('Europe/London')->locale('uk')->format('l jS \\of F Y');
        $maintenance_start_time = Carbon::parse($maintenanceRequest->start_time)->setTimezone('Europe/London')->locale('uk')->format('h:i A');
        $subject = "House Maintenance Scheduled";
        $messageBody = "<p>This is to inform you that maintenance has been scheduled for " . $maintenance_start_date . " and is due to start at " . $maintenance_start_time . "</p><p><a href='". config('app.url') . "/maintenance/" . $maintenance->id  ."'>Click here to view details of the scheduled maintenance</a></p>";

        app(JobController::class)->notificationEmail($subject, $messageBody);
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
            'title' => 'Maintenance',
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
        if(isset($request->paid) && $request->paid == true && $maintenance->paid == 0) {
            $this->treasuryService->createTreasurable(NULL, 'App\\Models\\Maintenance', $maintenance->id, 0, $maintenance->final_cost);
            $maintenance->update($request->all());
        } else {
            $maintenance->update($request->all());
        }
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
