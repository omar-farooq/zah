<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'start_time',
        'finish_time',
        'start_date',
        'end_date',
        'cost',
        'required_maintenance',
        'reason',
        'contractor',
        'contractor_email',
        'contractor_phone',
        'type',
        'user_id',
        'approval_status',
        'emergency'
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'start_time',
        'finish_time',
        'start_date',
        'end_date'
    ];

    protected $with = ['user', 'approvals'];


    /*
     * Waiting Approval
     */
    public function notYetApproved() {
        return $this->where('approval_status', 'in voting')->get();
    }

    /*
     *Relationship with user
     */
    public function user()
    {
        return $this->belongsTo(User::Class);
    }

    /*
     * Relationship with the approved maintenance
     */
    public function maintenance()
    {
        return $this->hasOne(Maintenance::Class);
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
