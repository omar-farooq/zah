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
        'comments'
    ];

    protected $dates = [
        'start_date',
        'end_date',
        'created_at',
        'updated_at'
    ];

    /*
     * Relationship with Treasury Items
     */
    public function treasuryItems() 
    {
        return $this->hasMany(TreasuryItem::class);
    }
}
