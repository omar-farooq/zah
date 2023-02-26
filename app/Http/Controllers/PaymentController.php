<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\TreasuryService;
use Illuminate\Http\Request;

class PaymentController extends Controller
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $new_payment = Payment::create($request->all());
        if($request->file('receipt')) {
            $this->treasuryService->addReceipt($request->file('receipt'), 'App\\Models\\Payment', $new_payment->id);
        }
        $this->treasuryService->createTreasurable($request->treasuryReportID, 'App\\Models\\Payment', $new_payment->id, $request->incoming, $request->amount);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
