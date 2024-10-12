<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaidRent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'treasury_report_id',
        'amount_paid',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function treasuryReport()
    {
        return $this->belongsTo(TreasuryReport::class);
    }
}
