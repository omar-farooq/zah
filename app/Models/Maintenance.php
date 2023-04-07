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

    protected $with = ['maintenanceRequest'];

    /*
     * Relationship with the request
     *
     */
    public function maintenanceRequest() 
    {
        return $this->belongsTo(MaintenanceRequest::Class);
    }

    /**
     * This is itemized by the Treasury for reports
     */
    public function treasuryItem()
    {
        return $this->morphOne(TreasuryItem::class, 'treasurable');
    }
}
