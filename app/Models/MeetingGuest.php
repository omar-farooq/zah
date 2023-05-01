<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingGuest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'meeting_id'
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::Class);
    }
}
