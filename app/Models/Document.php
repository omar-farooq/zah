<?php

namespace App\Models;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use BroadcastsEvents, HasFactory;

    protected $fillable = [
        'compulsory_viewing_for_all',
        'description',
        'original_name',
        'meeting_id',
        'permanent',
        'upload_name',
        'user_id'
    ];

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
