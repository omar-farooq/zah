<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'role_id',
        'approval_status'
    ];

    protected $with = ['approvals'];

    /*
     * Relationship with approvals
     *
     */
    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }

    /*
     * Get all assignments that are ongoing
     *
     */
    public function inVote() 
    {
        return $this->where('approval_status', 'in voting')->get();
    }
}
