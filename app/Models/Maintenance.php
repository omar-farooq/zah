<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;
    protected $fillable = [
        'maintenance_request_id',
        'final_cost',
        'additional_details',
        'paid'
    ];

    protected $with = ['maintenaceRequest'];

    /*
     * Relationship with the request
     *
     */
    public function maintenanceRequest() 
    {
        return $this->belongsTo(MaintenanceRequest::Class);
    }
}
