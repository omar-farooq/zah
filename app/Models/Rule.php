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
        'number',
        'rule_section_id',
        'approval_status',
    ];

    protected $with = ['approvals'];

    /*
     *Relationship with approvals
     */
    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }

    /*
     * Relationship with Rule Sections
     */
    public function ruleSection()
    {
        return $this->belongsTo(RuleSection::class);
    }

    /*
     * Relationship with changes to the rule
     */
    public function ruleChanges()
    {
        return $this->hasMany(RuleChange::class);
    }

    /*
     * Relationship with attempted deletes to the rule
     */
    public function ruleDeletes()
    {
        return $this->hasMany(RuleDelete::class);
    }
}
