<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreasuryPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'expected_incoming',
        'expected_outgoing',
        'available_balance',
        'expected_balance',
        'estimated_remaining_balance',
        'plan_length'
    ];

    public function planComponents() {
        return $this->belongsToMany(PlanComponent::class)->withPivot('priority');
    }
}
