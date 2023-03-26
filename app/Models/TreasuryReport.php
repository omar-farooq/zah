<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreasuryReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_date',
        'end_date',
        'comments',
        'calculated_remaining_budget',
        'remaining_budget'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /*
     * Relationship with Treasury Items
     */
    public function treasuryItems() 
    {
        return $this->hasMany(TreasuryItem::class);
    }
}
