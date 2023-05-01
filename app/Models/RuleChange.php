<?php

namespace App\Models;

use App\Models\Rule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuleChange extends Model
{
    use HasFactory;

    protected $fillable = [
        'rule_id',
        'rule',
        'approval_status'
    ];

    public function rule()
    {
        return $this->belongsTo(Rule::class);
    }
}
