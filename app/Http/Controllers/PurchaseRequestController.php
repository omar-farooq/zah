<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequestRequest;
use App\Http\Requests\UpdatePurchaseRequestRequest;
use App\Models\PurchaseRequest;
use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        if (isset($request->cards)) {
            $term = $request->search;

            if ($request->cards == 'needApproval') {
                $user_role = \App\Models\Role::where('user_id', Auth::id())->first()->name ?? 'null';

                return response()->json(
                    $purchaseRequest::where('approval_status', 'in voting')
                        ->when($user_role === 'Chair', function (Builder $q) {
                            $q->orWhere('approval_status', 'Chair to decide');
                        })
                        ->whereDoesntHave('approvals', function (Builder $q) {
                            $q->where('user_id', Auth::id());
                        })
                        ->paginate(4)
                );
            }

            if ($request->cards == 'all') {
                return response()->json(
                    $purchaseRequest
                        ->when($term, function ($q) use ($term) {
                            return $q->where('name', 'like', '%'.$term.'%')
                                ->orWhere('description', 'like', '%'.$term.'%');
                        })
                        ->orderBy('created_at', 'desc')
                        ->paginate(4)
                );
            }

        } else {
            return Inertia::render('PurchaseRequests/Browse', [
                'title' => 'All Purchase Requests',
                'requestNumber' => PurchaseRequest::count(),
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
            'title' => 'Make a Purchase Request',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * upload to gcs before adding to the database
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StorePurchaseRequestRequest $request)
    {
        $new_purchase_request = Auth::User()->purchaseRequests()->create($request->all());

        if ($request->file('image')) {
            $imageName = time().'.'.$request->image->getClientOriginalName();
            try {
                Storage::putFileAs('images', $request->image, $imageName);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => 'false',
                    'message' => 'Failed to upload image',
                ], 500);
            }
            $new_purchase_request['image'] = $imageName;
            $new_purchase_request->save();
        }

        //send email
        $email_subject = 'Purchase Request made';
        $messageBody = '<p>'.$request->name.' has been requested for the following reason:</p><p>'.$request->reason.'</p><p>please <a href="'.env('APP_URL').'/purchase-requests/'.$new_purchase_request->id.'">click here</a> and review the request as soon as possible.</p>';

        app(JobController::class)->notificationEmail($email_subject, $messageBody);

        return Redirect::route('purchase-requests.show', $new_purchase_request);

    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(PurchaseRequest $purchaseRequest)
    {
        return Inertia::render('PurchaseRequests/ViewPurchaseRequest', [
            'purchaseRequest' => $purchaseRequest,
            'title' => 'Request to purchase '.$purchaseRequest->name,
            'requestImage' => config('app.env') == 'production' ? Storage::temporaryUrl('images/'.$purchaseRequest->image, now()->addMinutes(5)) : Storage::url('images/'.$purchaseRequest->image),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(PurchaseRequest $purchaseRequest)
    {
        return Inertia::render('PurchaseRequests/EditRequestForm', [
            'title' => 'Edit your request',
            'requestImage' => config('app.env') == 'production' ? Storage::temporaryUrl('images/'.$purchaseRequest->image, now()->addMinutes(5)) : Storage::url('images/'.$purchaseRequest->image),
            'purchaseRequest' => $purchaseRequest,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePurchaseRequestRequest $request, PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->update([
            'name' => $request->formData['name'],
            'reason' => $request->formData['reason'],
            'price' => $request->formData['price'],
            'url' => $request->formData['url'],
            'quantity' => $request->formData['quantity'],
            'description' => $request->formData['description'],
            'delivery_cost' => $request->formData['delivery_cost'],
        ]);

        if ($request->formData['image'] != $purchaseRequest->image) {
            $imageName = time().'.'.$request->formData['image']->getClientOriginalName();
            try {
                Storage::putFileAs('images', $request->formData['image'], $imageName);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => 'false',
                    'message' => 'Failed to upload image',
                ], 500);
            }
            Storage::delete('images/'.$purchaseRequest->image);
            $purchaseRequest->update(['image' => $imageName]);
        }

        $purchaseRequest->approvals->each->delete();

        return Redirect::route('purchase-requests.show', $purchaseRequest);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        if ($purchaseRequest->user_id != Auth::id()) {
            return;
        }

        $purchaseRequest->delete();

        return Redirect::route('purchase-requests.index');
    }
}
