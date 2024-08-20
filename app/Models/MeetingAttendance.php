<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAttendance extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'meeting_id',
        'late',
    ];

    protected $with = [
       'user' 
    ];

    public $timestamps = false;

    /*
     * Relationship with users
     *
     */
    public function user()
    {
        return $this->belongsTo(User::Class);
    }

    /*
     * Relationship with meetings
     *
     */
    public function meeting()
    {
        return $this->belongsTo(Meeting::Class);
    }
}
