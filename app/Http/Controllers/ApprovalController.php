<?php

namespace App\Http\Controllers;

use Auth;
use App\Models\Approval;
use App\Services\ApprovalService;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{

    /**
     * Instantiate the Service
     *
     */
    public function __construct() {
        $this->approvalService = new ApprovalService;
    }

    /**
     * Get approvals for model
     *
     */
    public function index(Request $request, Approval $approval) {
        if(isset($request->model) && isset($request->id)) {
            return response()->json([
                'approved' => $approval->where('approvable_type', $request->model)
                                       ->where('approvable_id',$request->id)
                                       ->where('approval', 'approved')
                                       ->count(),

                'rejected' => $approval->where('approvable_type', $request->model)
                                       ->where('approvable_id',$request->id)
                                       ->where('approval', 'rejected')
                                       ->count(),
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newApproval = Auth::User()->approvals()->create($request->all());
        return response()->json([
            'id' => $newApproval->id
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Approval  $approval
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Approval $approval)
    {
        $approval->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Approval  $approval
     * @return \Illuminate\Http\Response
     */
    public function destroy(Approval $approval)
    {
        //
    }

    /**
     * Update a model's approval status if approval is greater than member count / 2
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateModelApproval(Request $request) 
    {
        $model = $request->model::where('id', $request->id)->first();
        $model->approval_status = $request->approval;
        $model->save();

        if($request->approval == 'approved') {
            $this->approvalService->approvalFollowUp($request->model, $request->id);
        }

        return response()->json(
            $request->approval
        );
    }
}
