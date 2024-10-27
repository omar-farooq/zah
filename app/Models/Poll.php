<?php

namespace App\Models;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poll extends Model
{
    use BroadcastsEvents, HasFactory;

    protected $fillable = [
        'name',
        'meeting_id',
    ];

    protected $casts = ['poll_end' => 'datetime'];

    protected $with = ['pollItems'];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function pollItems()
    {
        return $this->hasMany(PollOption::class);
    }

    public function broadcastOn($event)
    {
        return [new PrivateChannel('meeting')];
    }
}
