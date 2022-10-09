<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'start',
        'finish',
        'cost',
        'required_maintenance',
        'reason',
        'contractor',
        'type',
        'user_id',
        'emergency'
    ];

    protected $with = ['user', 'approvals'];

    /*
     *Relationship with user
     */
    public function user()
    {
        return $this->belongsTo(User::Class);
    }

    /*
     * Relationship with approvals
     */
    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }

    /*
     * Relationship with comments
     */
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
