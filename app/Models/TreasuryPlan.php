<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreasuryPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'component',
        'cost',
        'priority',
        'plan_length'
    ];
}
