<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Minute extends Model
{
    use HasFactory;

    protected $fillable = ['minute_text', 'meeting_id'];

    public function meeting() {
        return $this->belongsTo(Meeting::Class);
    }
}
