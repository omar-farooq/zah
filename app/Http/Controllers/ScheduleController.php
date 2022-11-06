<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Meeting;
use App\Models\User;
use App\Models\Schedule;
use App\Models\ScheduleSuggestion;
use App\Services\ScheduleService;
use Carbon\Carbon;
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

	public function browse(Schedule $schedule, User $users, ScheduleService $scheduleService)
	{
        return Inertia::render('Meetings/Schedule', [
            'upcomingDate' => $scheduleService->upcoming()['upcomingDate'],
            'upcomingID' => $scheduleService->upcoming()['upcomingID'],
            'members' => $users->currentMember()->with('scheduleSuggestions')->get(),
            'schedule' => $schedule->current(),
			'currentUser' => Auth::user()
        ]);
	}

	/**
	* Update availability
	*
	* @param \App\Http\Requests\StoreScheduleAvailability $request
	* @param string id
	*
	* @return \Illuminate\Http\Response
	*/

    public function updateAvailability(Request $request) {

        if(isset($request->updateDates)) {
            foreach($request->updateDates as $date) {
                Schedule::where('date', Carbon::parse($date)->format('Y-m-d H:i:s'))
                    ->where('user_id', Auth::id())
                    ->first()
                    ->update(['availability' => $request->availability]);
            }   
        }

        if(isset($request->addDates)) {
            foreach($request->addDates as $date) {
                $newSchedule = new Schedule;
                $newSchedule->date = $date;
                $newSchedule->user_id = Auth::id();
                $newSchedule->availability = $request->availability;
                $newSchedule->save();
            }
        }

        $schedule = new Schedule();
        return response()->json(
            $schedule->current()
		);
    }

	/**
	* Create a suggestion
	*
	* @param \App\Http\Requests\StoreScheduleSuggestionRequest $request
	*
	* @return \Illuminatee\Http\Response
	*/

	public function addSuggestion(Request $request) {
		$scheduleSuggestion = new ScheduleSuggestion;
		$scheduleSuggestion->suggested_date = $request->suggested_date;
		$scheduleSuggestion->user_id = $request->user_id;
		$scheduleSuggestion->save();
		return response()->json([
			'id' => $scheduleSuggestion->id
		]);
	}

	/**
	* Delete a suggestion
	*
	* @param \Illuminate\Http\Request $request
	* @param \App\Models\ScheduleSuggestion $scheduleSuggestion
	*
	* @return \Illuminate\Http\Response
	*/

	public function removeSuggestion(Request $request, ScheduleSuggestion $scheduleSuggestion) {
		$scheduleSuggestion::destroy($request->id);
	}
}
