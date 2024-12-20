<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Receipt;
use App\Services\TreasuryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    /**
     * Instantiate Treasury Service
     */
    public function __construct()
    {
        $this->treasuryService = new TreasuryService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->has('account')) {
            $incomingTotal = Payment::where('treasury_report_id', null)
                ->where('account_id', $request->account)
                ->where('incoming', 1)
                ->sum('amount');
            $outgoingTotal = Payment::where('treasury_report_id', null)
                ->where('account_id', $request->account)
                ->where('incoming', 0)
                ->sum('amount');
            $accountTotal = $incomingTotal - $outgoingTotal;

            return response()->json($accountTotal);
        } else {
            return response()->json(Payment::where('treasury_report_id', null)->get());
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|decimal:2',
            'incoming' => 'boolean',
            'payment_date' => 'date',
            'receipt' => 'nullable|file',
        ]);

        $new_payment = Payment::create($request->all());
        if ($request->file('receipt')) {
            $this->treasuryService->addReceipt($request->file('receipt'), 'App\\Models\\Payment', $new_payment->id);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'successfully saved',
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Payment $payment, Request $request)
    {
        if ($request->has('description')) {
            return response()->json($payment['description']);
        } else {
            return response()->json($payment);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payment $payment)
    {
        //delete the receipt before deleting the payment
        $receipt = new Receipt;
        $found_receipt = $receipt->where('payable_type', 'App\\Models\\Payment')->where('payable_id', $payment->id)->first();
        if ($found_receipt !== null) {
            Storage::delete('documents/receipts/'.$found_receipt->receipt);
            $found_receipt->delete();
        }
        $payment->delete();
    }
}
