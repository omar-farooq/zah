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
        'name',
        'late',
        'guest'
    ];

    /*
     * Relationship with users
     *
     */
    public function users()
    {
        return $this->hasMany(User::Class);
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
