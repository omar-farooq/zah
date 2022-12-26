<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PollOption extends Model
{
    use HasFactory;
    protected $fillable = [
        'poll_id',
        'option'
    ];

    protected $with = ['votes'];

    public function poll() {
        return $this->belongsTo(Poll::class);
    }

    public function votes() {
        return $this->hasMany(Vote::class);
    }
}
