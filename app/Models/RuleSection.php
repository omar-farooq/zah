<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuleSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'number',
    ];

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }
}
