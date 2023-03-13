<?php

namespace App\Http\Controllers;

use App\Models\RecurringPayment;
use App\Models\Rent;
use App\Models\TreasuryPlan;
use App\Models\TreasuryReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Treasury/Plan', [
            'title' => 'Treasury Planning',
            'fiveYearPlan' => TreasuryPlan::where('plan_length', '5y')->orderBy('priority')->get(),
            'balance' => TreasuryReport::latest()->first()->remaining_budget,
            'rent' => Rent::pluck('amount')->sum(),
            'weeklyRecurringPayments' => RecurringPayment::where('frequency', 'weekly')->pluck('amount')->sum(),
            'monthlyRecurringPayments' => RecurringPayment::where('frequency', 'monthly')->pluck('amount')->sum(),
            'annualRecurringPayments' => RecurringPayment::where('frequency', 'annually')->pluck('amount')->sum(),
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
        $plan = TreasuryPlan::Create($request->all());
        return response()->json([
            'id' => $plan->id
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TreasuryPlan  $treasuryPlan
     * @return \Illuminate\Http\Response
     */
    public function show(TreasuryPlan $treasuryPlan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TreasuryPlan  $treasuryPlan
     * @return \Illuminate\Http\Response
     */
    public function edit(TreasuryPlan $treasuryPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TreasuryPlan  $treasuryPlan
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TreasuryPlan $treasuryPlan)
    {
        $treasuryPlan->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TreasuryPlan  $treasuryPlan
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        TreasuryPlan::destroy($id);
    }
}
