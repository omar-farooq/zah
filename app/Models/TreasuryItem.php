<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreasuryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'treasurable_id',
        'treasurable_type',
        'treasury_report_id',
        'amount',
        'is_incoming'
    ];

    /*
     * Relationship with the Treasury Report
     */
    public function treasuryReport()
    {
        return $this->belongsTo(TreasuryReport::Class);
    }

    /*
     * Account this treasurable belongs to
     */
    public function account() 
    {
        return $this->belongsTo(Account::Class);
    }

    /*
     * Morph relationships
     */
    public function treasurable()
    {
        return $this->morphTo();
    }
}
