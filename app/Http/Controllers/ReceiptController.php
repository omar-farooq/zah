<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(isset($request->model) && isset($request->id)) {
            return response()->json(
                Receipt::where('payable_type', $request->model)
                        ->where('payable_id', $request->id)
                        ->get()
            );
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $receipt = new Receipt;
        $receiptName = date('Ymdhis') . $request->receiptFile->getClientOriginalName();

        //Upload to storage
        try {
            Storage::disk('spaces')->putFileAs('documents/receipts', $request->receiptFile, $receiptName);
        } catch (\Exception $e) {
            return $e->getMessage();
        }

        //Add to the database
        $receipt['receipt'] = $receiptName;
        $receipt['payable_type'] = $request->payable_type;
        $receipt['payable_id'] = $request->payable_id;
        $receipt->save();

        if(isset($receipt->id)) {
            return response()->json([
                'success' => 'true',
                'message' => 'receipt successfully uploaded'
            ],200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Receipt  $receipt
     * @return \Illuminate\Http\Response
     */
    public function show(Receipt $receipt)
    {
        //S3 specific
        //Storage::temporaryUrl($receipt->receipt, now()->addMinutes(2));

        //Local driver
        return Storage::disk('spaces')->download('documents/receipts/'.$receipt->receipt);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Receipt  $receipt
     * @return \Illuminate\Http\Response
     */
    public function edit(Receipt $receipt)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Receipt  $receipt
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Receipt $receipt)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Receipt  $receipt
     * @return \Illuminate\Http\Response
     */
    public function destroy(Receipt $receipt)
    {
        Storage::disk('spaces')->delete('documents/receipts/'.$receipt->receipt);
        Receipt::destroy($receipt->id);
    }
}
