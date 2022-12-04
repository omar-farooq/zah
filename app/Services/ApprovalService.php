<?php

namespace App\Services;

use App\Models\Maintenance;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PurchaseController;
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
                $purchaseController = new PurchaseController();
                return $purchaseController->store($id);
                break;

            case "App\Models\MaintenanceRequest":
                $maintenanceController = new MaintenanceController();
                return $maintenanceController->store($id);
                break;
        }
    }

    function roleAssignment($id)
    {
        $roleAssignment = RoleAssignment::find($id)->first();
        Role::where('id', $roleAssignment->role_id)->update(['user_id' => $roleAssignment->user_id]);
    }

}
