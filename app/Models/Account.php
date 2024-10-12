<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_name',
        'bank',
        'description',
        'starting_balance',
    ];

    /**
     * Relationship with treasury reports
     */
    public function treasuryReports(): BelongsToMany
    {
        return $this->belongsToMany(TreasuryReport::class)->withPivot('account_balance');
    }
}
