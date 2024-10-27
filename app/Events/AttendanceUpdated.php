<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AttendanceUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $lateAttendees;

    public $punctualAttendees;

    /**
     * Create a new event instance.
     */
    public function __construct($lateAttendees, $punctualAttendees)
    {
        $this->lateAttendees = $lateAttendees;
        $this->punctualAttendees = $punctualAttendees;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('meeting-register'),
        ];
    }
}
