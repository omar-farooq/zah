<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecurringPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient',
        'description',
        'frequency',
        'day_of_week_due',
        'day_of_month_due',
        'month_due',
        'amount'
    ];
}
