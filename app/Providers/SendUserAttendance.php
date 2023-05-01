<?php

namespace App\Providers;

use App\Providers\UserAttendingMeeting;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendUserAttendance
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
    public function handle(UserAttendingMeeting $event): void
    {
        //
    }
}
