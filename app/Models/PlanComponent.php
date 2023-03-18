<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanComponent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'component',
        'cost',
        'plan_length'
    ];

    public function treasuryPlan() {
        return $this->belongsToMany(TreasuryPlan::class)->withPivot('priority');
    }
}
