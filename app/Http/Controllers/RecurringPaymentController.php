<?php

namespace App\Http\Controllers;

use App\Models\RecurringPayment;
use Illuminate\Http\Request;

class RecurringPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            RecurringPayment::all()
        );
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        RecurringPayment::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RecurringPayment  $recurringPayment
     * @return \Illuminate\Http\Response
     */
    public function show(RecurringPayment $recurringPayment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RecurringPayment  $recurringPayment
     * @return \Illuminate\Http\Response
     */
    public function edit(RecurringPayment $recurringPayment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RecurringPayment  $recurringPayment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RecurringPayment $recurringPayment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RecurringPayment  $recurringPayment
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecurringPayment $recurringPayment)
    {
        $recurringPayment->delete();
    }
}
