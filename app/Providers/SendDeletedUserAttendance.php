<?php

namespace App\Providers;

use App\Providers\UserMeetingAttendanceDeleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

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
