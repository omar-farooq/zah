<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_request_id',
        'purchased',
        'received',
        'name',
        'price',
        'delivery_cost',
        'description',
        'reason',
        'image',
        'quantity',
    ];

    public function purchaseRequest()
    {
        return $this->belongsTo(PurchaseRequest::class);
    }

    /**
     * This is itemized by the Treasury for reports
     */
    public function treasuryItem()
    {
        return $this->morphOne(TreasuryItem::class, 'treasurable');
    }
}
