<?php

namespace App\Providers;

class SendDeletedUserAttendance
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
    public function handle(UserMeetingAttendanceDeleted $event): void
    {
        //
    }
}
