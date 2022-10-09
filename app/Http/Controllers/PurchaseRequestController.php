<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequestRequest;
use App\Http\Requests\UpdatePurchaseRequestRequest;
use App\Models\PurchaseRequest;
use Auth;
use Inertia\Inertia;
use Redirect;

class PurchaseRequestController extends Controller
{
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
        return Inertia::render('Purchases/RequestForm');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StorePurchaseRequestRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePurchaseRequestRequest $request)
    {
        $new_purchase_request = Auth::User()->purchaseRequests()->create($request->all());

        if($request->file('image')) {
            $imageName = time() . '.' .$request->image->getClientOriginalName();
            $request->image->move(public_path('images'), $imageName);
            $new_purchase_request['image'] = $imageName;
            $new_purchase_request->save();
        }

            return Redirect::route('purchase-requests.show', $new_purchase_request);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function show(PurchaseRequest $purchaseRequest)
    {
        return Inertia::render('Purchases/ViewPurchaseRequest', compact('purchaseRequest'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(PurchaseRequest $purchaseRequest)
    {
        return Inertia::render('Purchases/EditRequestForm', compact('purchaseRequest'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdatePurchaseRequestRequest  $request
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePurchaseRequestRequest $request, PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->update($request->all());

       /* 
        if($request->file('image') != $purchaseRequest->image) {
            $imageName = time() . '.' .$request->image->getClientOriginalName();
            $request->image->move(public_path('images'), $imageName);
            $purchaseRequest['image'] = $imageName;
            $purchaseRequest->save();
        }
        */
            
        $purchaseRequest->approvals->each->delete();
        return Redirect::route('purchase-requests.show', $purchaseRequest);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        //
    }
}
