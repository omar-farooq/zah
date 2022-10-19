<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
        'delivery_cost',
        'description',
        'reason',
        'url',
        'image',
        'quantity',
        'user_id',
        'approved',
        'rejected'
    ];

    protected $with = ['user', 'approvals'];


    /*
     * Waiting approval
     *
     */
    public function notYetApproved() {
        return $this->where('approved', 0)->where('rejected', 0)->get();
    }

    /*
     * Relationship with user
     *
     */
    public function user() 
    {
        return $this->belongsTo(User::Class);
    }

    /*
     * Relationship with approvals
     *
     *
     */
    public function approvals()
    {
       return $this->morphMany(Approval::class, 'approvable'); 
    }

    /*
     * Relationship with approvals
     *
     *
     */
    public function comments()
    {
       return $this->morphMany(Comment::class, 'commentable'); 
    }
}
