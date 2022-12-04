<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Models\Purchase;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Purchase $purchase, Request $request)
    {
        if(isset($request->cards)) {

            if($request->cards == 'needAction') {
                return response()->json(
                    $purchase->where('received', '0')->orderBy('created_at', 'desc')->paginate(4),
                );
            }

            if($request->cards == 'received') {
                return response()->json(
                    $purchase->where('received', '1')->orderBy('created_at', 'desc')->paginate(4),
                );
            }

        } else {
            return Inertia::render('Purchases/Browse', [
                'title' => 'All Purchases',
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($purchase_request_id)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StorePurchaseRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store($purchase_request_id)
    {
        $purchaseRequest = PurchaseRequest::find($purchase_request_id);

        Purchase::create([
            'purchase_request_id' => $purchase_request_id,
            'name' => $purchaseRequest->name,
            'price' => $purchaseRequest->price,
            'delivery_cost' => $purchaseRequest->delivery_cost,
            'description' => $purchaseRequest->description,
            'reason' => $purchaseRequest->reason,
            'image' => $purchaseRequest->image,
            'quantity' => $purchaseRequest->quantity
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function show(Purchase $purchase)
    {
        return Inertia::render('Purchases/ViewPurchase', [
            'title' => 'Purchased',
            'purchase' => $purchase
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function edit(Purchase $purchase)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdatePurchaseRequest  $request
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function destroy(Purchase $purchase)
    {
        //
    }
}
