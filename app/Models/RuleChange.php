<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuleChange extends Model
{
    use HasFactory;

    protected $fillable = [
        'rule_id',
        'rule',
        'approval_status',
    ];

    protected $with = ['approvals'];

    public function rule()
    {
        return $this->belongsTo(Rule::class);
    }

    /*
     * Relationship with approvals
     */
    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }
}
