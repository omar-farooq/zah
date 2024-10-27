<?php

namespace App\Listeners;

use App\Events\GuestListUpdated;

class SendUpdatedGuestList
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
    public function handle(GuestListUpdated $event): void
    {
        //
    }
}
