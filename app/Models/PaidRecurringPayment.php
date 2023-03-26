<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaidRecurringPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'recurring_payment_id',
        'treasury_report_id',
        'amount_paid'
    ];

    public function recurringPayment()
    {
        return $this->belongsTo(RecurringPayment::class);
    }

    public function treasuryReport()
    {
        return $this->belongsTo(TreasuryReport::class);
    }
}
