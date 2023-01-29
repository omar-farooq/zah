<?php

namespace App\Models;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use BroadcastsEvents, HasFactory;

    protected $fillable = [
        'due_by',
        'item',
        'completed',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'due_by',
    ];

    /**
     * Relationship with Users
     *
     */
    public function users() {
        return $this->belongsToMany(User::class);
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
