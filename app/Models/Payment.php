<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'incoming',
        'name',
        'description',
        'payment_date'
    ];

    /*
     * This is itemized by the Treasury for reports
     */
    public function treasuryItem()
    {
        return $this->morphOne(TreasuryItem::class, 'treasurable');
    }
}
