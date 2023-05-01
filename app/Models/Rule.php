<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rule extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'rule',
        'rule_number',
        'approval_status'
    ];

    protected $with = ['approvals'];

    /*
     *Relationship with approvals
     */
    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }
}
