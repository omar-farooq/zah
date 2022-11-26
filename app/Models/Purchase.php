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
        'delivered'
    ];

    protected $with = ['purchaseRequest'];

    public function purchaseRequest() {
        return $this->belongsTo(PurchaseRequest::class);
    }
}
