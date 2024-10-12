<?php

namespace App\Models;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use BroadcastsEvents, HasFactory;

    protected $fillable = [
        'user_id',
        'poll_option_id',
    ];

    public function pollOption()
    {
        return $this->belongsTo(PollOption::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function broadcastOn($event)
    {
        return [new PrivateChannel('meeting')];
    }
}
