<?php

namespace App\Http\Controllers;

use App\Models\Rent;
use App\Models\RentArrear;
use App\Models\TreasuryReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Treasury/Reports/index', [
            'title' => 'Treasury Report',
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TreasuryReport  $treasuryReport
     * @return \Illuminate\Http\Response
     */
    public function show(TreasuryReport $treasuryReport)
    {
        //
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
