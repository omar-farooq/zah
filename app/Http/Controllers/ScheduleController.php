<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Meeting;
use App\Models\Membership;
use App\Models\Schedule;
use App\Services\ScheduleService;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
	* Display the schedule
	*
	* @param \App\Models\Membership $membership
	* @param \App\Models\Schedule $schedule
	* @param \App\Services\ScheduleService $scheduleService
	*
	* @return \Inertia\Response
	*/

	public function browse(Schedule $schedule, Membership $membership, ScheduleService $scheduleService)
	{
        return Inertia::render('Meetings/Upcoming', [
            'upcomingDate' => $scheduleService->upcoming()['upcomingDate'],
            'upcomingID' => $scheduleService->upcoming()['upcomingID'],
            'memberships' => $membership->getMembers(),
            'schedule' => $schedule->get(),
			'currentUser' => Auth::user()
        ]);
	}
}
