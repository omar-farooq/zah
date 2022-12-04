<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequestRequest;
use App\Http\Requests\UpdatePurchaseRequestRequest;
use App\Models\PurchaseRequest;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Redirect;

class PurchaseRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(PurchaseRequest $purchaseRequest, Request $request)
    {
        if(isset($request->cards)) {

            $userApproved = [];
            if($request->cards == 'needApproval') {
                foreach($purchaseRequest->all() as $pr) {
                    foreach($pr->approvals as $approval){
                        if($approval->user_id == Auth::id()) {
                            array_push($userApproved, $pr);
                        }
                    }
                }
                return response()->json(
                    $purchaseRequest->all()->diff($userApproved)
                );
            }

            if($request->cards == 'all') {
                return response()->json(
                    $purchaseRequest->orderBy('created_at', 'desc')->paginate(4)
                );
            }

        } else {
            return Inertia::render('PurchaseRequests/Browse', [
                'title' => 'All Purchase Requests'
            ]);    
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Purchases/RequestForm', [
            'title' => 'Make a Purchase Request'
        ]);
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
        return Inertia::render('Purchases/ViewPurchaseRequest', [
            'purchaseRequest' => $purchaseRequest,
            'title' => 'Request to purchase ' .$purchaseRequest->name
        ]);
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
