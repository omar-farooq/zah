<?php

namespace App\Listeners;

use App\Events\AttendanceUpdated;

class SendAttendanceChange
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AttendanceUpdated $event): void
    {
        //
    }
}
