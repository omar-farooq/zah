<?php

namespace App\Services;

use App\Models\Maintenance;
use App\Models\MaintenanceRequest;
use App\Models\Purchase;
use App\Models\PurchaseRequest;
use App\Models\Role;
use App\Models\RoleAssignment;

class ApprovalService {

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
                return $this->createPurchase($id);
                break;

            case "App\Models\MaintenanceRequest":
                return $this->createMaintenance($id);
                break;
        }
    }

    function roleAssignment($id)
    {
        $roleAssignment = RoleAssignment::find($id)->first();
        Role::where('id', $roleAssignment->role_id)->update(['user_id' => $roleAssignment->user_id]);
    }

    function createPurchase($id)
    {
//TO DO
    }

    function createMaintenance($id)
    {
//TO DO
    }
}
