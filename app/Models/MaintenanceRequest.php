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
        'contractor_email',
        'contractor_phone',
        'type',
        'user_id',
        'approved',
        'rejected',
        'emergency'
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'start',
        'finish'
    ];

    protected $with = ['user', 'approvals'];


    /*
     * Waiting Approval
     */
    public function notYetApproved() {
        return $this->where('approved', 0)->where('rejected', 0)->get();
    }

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
