<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecretaryReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'report',
        'attachment',
        'user_id',
        'meeting_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function meeting() {
        return $this->belongsTo(Meeting::class);
    }
}
