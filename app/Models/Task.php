<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'due_by',
        'item',
        'completed',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'due_by',
    ];

    /**
     * Relationship with Users
     *
     */
    public function users() {
        return $this->belongsToMany(User::class);
    }
}
