<?php

namespace App\Http\Controllers;

use App\Models\PlanComponent;
use App\Models\RecurringPayment;
use App\Models\Rent;
use App\Models\TreasuryPlan;
use App\Models\TreasuryReport;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        if(isset($request->getPage) && $request->getPage == true) {
            return response()->json(
                TreasuryPlan::paginate(10)
            );
        } else {
            return Inertia::render('Treasury/Plans/Index', [
                'title' => 'Treasury Plans',
                'treasuryPlansPageOne' => TreasuryPlan::paginate(10)
            ]);
        }
    }

    /**
     *
     *
     */
    public function create()
    {        
        return Inertia::render('Treasury/Plans/Create', [
            'title' => 'Treasury Planning',
            'lastPlan' => TreasuryPlan::latest()->first(),
            'balance' => TreasuryReport::latest()->first()->remaining_budget ?? 0,
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
//        $plan = TreasuryPlan::Create($request->except('components'));
        $plan = Auth::User()->treasuryPlans()->create($request->except('components'));
        foreach($request->input('components') as $component) {
            $newComponent = PlanComponent::create($component);
            $plan->planComponents()->attach([$newComponent->id => ['priority' => $component['priority']]]);
        }
        return response()->json($plan->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TreasuryPlan  $treasuryPlan
     * @return \Illuminate\Http\Response
     */
    public function show(TreasuryPlan $treasuryPlan)
    {
        return Inertia::render('Treasury/Plans/View', [
            'title' => 'View treasury plan',
            'treasuryPlan' => TreasuryPlan::with('planComponents')->where('id', $treasuryPlan->id)->first()
        ]);
    }

    /**
     * Show the latest
     *
     * @return \Illuminate\Http\Response
     */
    public function latest()
    {        
        if(TreasuryPlan::count() == 0) {
            return $this->create();
        } else {
            return $this->show(TreasuryPlan::with('planComponents')->latest()->first());
        }
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
