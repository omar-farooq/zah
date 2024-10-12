<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Models\Purchase;
use App\Models\PurchaseRequest;
use App\Services\TreasuryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PurchaseController extends Controller
{

    /**
     * Instantiate the Treasury Service
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
    public function index(Purchase $purchase, Request $request)
    {
        if(isset($request->cards)) {
            $term = $request->search;

            if($request->cards == 'needAction') {
                return response()->json(
                    $purchase->where('received', '0')->orderBy('created_at', 'desc')->paginate(4),
                );
            }

            if($request->cards == 'received') {
                return response()->json(
                    $purchase->where('received', '1')
                             ->when($term, function($q) use ($term) {
                                 return $q->where('name', 'like', '%'.$term.'%')
                                          ->orWhere('description', 'like', '%'.$term.'%')
                                          ->where('received', '1');
                             })
                             ->orderBy('created_at', 'desc')
                             ->paginate(4),
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
    public function show(Purchase $purchase, Request $request)
    {
        if(isset($request->getPurchase)) {
            return response()->json(
                $purchase
            );
        } else {
            return Inertia::render('Purchases/ViewPurchase', [
                'title' => 'Purchase History',
                'purchaseID' => $purchase->id,
                'purchaseImage' => config('app.env') == 'production' ? Storage::temporaryUrl('images/'.$purchase->image, now()->addMinutes(5)) : Storage::url('images/'.$purchase->image),
            ]);
        }
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
    public function update(Request $request, Purchase $purchase)
    {
        if(isset($request->purchased) && $request->purchased && $purchase->purchased == 0) {
            $this->treasuryService->createTreasurable(NULL, 'App\\Models\\Purchase', $purchase->id, 0, $purchase->price);
            $purchase->update($request->all());
        } else {
            $purchase->update($request->all());
        }
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
