<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuleDelete extends Model
{
    use HasFactory;

    protected $fillable = [
        'rule_id',
        'approval_status',
    ];

    protected $with = ['approvals'];

    public function rule()
    {
        return $this->belongsTo(Rule::class);
    }

    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }
}
