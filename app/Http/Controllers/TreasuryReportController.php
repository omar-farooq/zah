<?php

namespace App\Http\Controllers;

use App\Models\PaidRent;
use App\Models\Rent;
use App\Models\RentArrear;
use App\Models\TreasuryItem;
use App\Models\TreasuryReport;
use App\Services\TreasuryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryReportController extends Controller
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
    public function index()
    {
        return Inertia::render('Treasury/Reports/index', [
            'title' => 'Treasury Report',
            'reports' => TreasuryReport::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $arrears = new RentArrear;
        return Inertia::render('Treasury/Reports/Create', [
            'title' => 'Create Treasury Report',
            'rents' => Rent::with('user')->get(),
            'arrears' => $arrears->currentTenant()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->treasuryService->createReport($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function show(TreasuryReport $treasuryReport)
    {

        $treasuryItems = TreasuryItem::where('treasury_report_id', $treasuryReport->id);
        $rents = PaidRent::where('treasury_report_id', $treasuryReport->id)
                        ->with('user')
                        ->get();
        $outgoing_payments = TreasuryItem::where('treasury_report_id', $treasuryReport->id)
                                            ->where('treasurable_type', 'App\Models\Payment')
                                            ->where('is_incoming', '0')
                                            ->get();
        $incoming_payments = TreasuryItem::where('treasury_report_id', $treasuryReport->id)
                                            ->where('treasurable_type', 'App\Models\Payment')
                                            ->where('is_incoming', '1')
                                            ->get();

        return Inertia::render('Treasury/Reports/View', [
            'title' => 'View Treasury Report',
            'report' => $treasuryReport,
            'rents' => $rents,
            'incomingPayments' => $incoming_payments,
            'outgoingPayments' => $outgoing_payments
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function edit(TreasuryReport $treasuryReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TreasuryReport $treasuryReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function destroy(TreasuryReport $treasuryReport)
    {
        //
    }
}
