<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAgenda extends Model
{
    use HasFactory;

    protected $fillable = ['item', 'user_id', 'meeting_id'];

    public function meeting() {
        return $this->belongsTo(Meeting::Class);
    }
}
