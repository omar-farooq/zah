<?php

namespace App\Models;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecretaryReport extends Model
{
    use BroadcastsEvents, HasFactory;

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

    /**
     * Get the channels that the model events should be broadcast on
     *
     * @param string $event
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn($event)
    {
        return [new PrivateChannel ('meeting')];
    }

}
