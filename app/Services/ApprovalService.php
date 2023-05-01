<?php

namespace App\Services;

use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RuleController;
use App\Models\Approval;
use App\Models\Maintenance;
use App\Models\Membership;
use App\Models\PurchaseRequest;
use App\Models\Role;
use App\Models\RoleAssignment;
use Carbon\Carbon;

class ApprovalService {

    /**
     * Check if Membership has been approved by majority voting
     *
     * For voting in a new member:
     * get the total number of members, the total number of votes by members and the total number of votes fo the user you just voted for
     * If the number of votes for the new nominee exceed the number of members / 2 then they are approved
     * if the number of votes is equal to the number of members then evaluate the new member
     * If it's a draw then it goes for the chair to decide
     *
     * For voting out a member:
     * If the number of votes to remove membership is more than half the number of users then a delete process is invoked
     *
     * @param $request
     *
     * @return null
     */
    function checkApproval($request)
    {
        if(isset($request->approvable_type) && $request->approvable_type == 'App\Models\Membership') {
            $membership = new Membership;
            $current_member_total = $membership->getMembers()->count();

            if($request->approval == 'add') {

                $total_add_vote_counts = Approval::where('approvable_type', 'App\Models\Membership')
                                                    ->where('created_at', '>', Carbon::now()->subDays(2))
                                                    ->where('approval', 'add')
                                                    ->count();

                $voted_for_user_add_vote_count = Approval::where('approvable_type', 'App\Models\Membership')
                                          ->where('approvable_id', $request->approvable_id)
                                          ->where('created_at', '>', Carbon::now()->subDays(2))
                                          ->where('approval', 'add')
                                          ->count();

                if($voted_for_user_add_vote_count > ($current_member_total / 2)) {
                    return $this->approvalFollowUp($request->approvable_type, $request->approvable_id);
                }

                if($total_add_vote_counts == $current_member_total) {
                        $final_results = Approval::selectRaw('approvable_id, COUNT(*) as count')
                                                ->where('approval', 'add')
                                                ->groupBy('approvable_id')
                                                ->orderBy('count', 'desc')
                                                ->get();

                        if($final_results[0]['count'] == $final_results[1]['count']) {
                            //this is a draw and is decided by the chair's vote
                            $chair_member_id = Role::where('name', 'chair')->get()->user_id;
                            $drawn_member_id = Approval::where('approvable_type', $request->approvable_type)
                                                        ->where('user_id', $chair_member_id)
                                                        ->get()->approvable_id;

                            return $this->approvalFollowUp($request->approvable_type, $drawn_member_id);
                        } else {
                            return $this->approvalFollowUp($request->approvable_type, $final_results[0]['approvable_id']);
                        }
                }

            } elseif($request->approval == 'delete') {
                $voted_for_user_delete_vote_count = Approval::where('approvable_type', $request->approvable_type)
                                                            ->where('approvable_id', $request->approvable_id)
                                                            ->where('created_at', '>', Carbon::now()->subDays(2))
                                                            ->where('approval', 'delete')
                                                            ->count();

                if($voted_for_user_delete_vote_count > ($current_member_total / 2)) {
                    return $this->deleteFollowUp($request->approvable_id);
                } else {
                    return;
                }
            } else {
                return;
            }


        }        
    }


   /**
    * Approval is given
    * Follow up action is required on the approved model
    * i.e. reassign role, create purchase, create maintenance
    *
    * @param string $model
    *
    * @return null
    */
    function approvalFollowUp(string $model, int $id) 
    {
        switch ($model) {
            case "App\Models\RoleAssignment":
                return $this->roleAssignment($id);
                break;        

            case "App\Models\PurchaseRequest":
                $purchaseController = new PurchaseController();
                return $purchaseController->store($id);
                break;

            case "App\Models\MaintenanceRequest":
                $maintenanceController = new MaintenanceController();
                return $maintenanceController->store($id);
                break;

            case "App\Models\Membership":
                $membershipController = new MembershipController();
                return $membershipController->store($id);
                break;

            case "App\Models\Rule":
                $ruleController = new RuleController();
                return $ruleController->approved($id);
                break;
        }
    }

    /**
     * Deletion is approved
     * Technically an approval but a separate type of approval
     * this specific case is to remove a user's membership by setting an end date
     *
     * @param string $model
     * @param int $id
     *
     * @return null
     */
    function deleteFollowUp(int $id)
    {
        $membershipController = new MembershipController();
        return $membershipController->destroy($id);
    }

    function roleAssignment($id)
    {
        $roleAssignment = RoleAssignment::find($id)->first();
        Role::where('id', $roleAssignment->role_id)->update(['user_id' => $roleAssignment->user_id]);
    }

}
