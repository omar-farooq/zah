<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Schedule;
use App\Models\ScheduleSuggestion;
use App\Models\User;
use App\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Get the schedule
     *
     * @param  Illuminate\Http\Request  $request
     * @return json $response
     */
    public function scheduled(Request $request)
    {
        $meeting = new Meeting;
        $scheduled = $meeting->allUpcoming();

        return response()->json($scheduled);
    }

    /**
     * Display the schedule
     *
     * @param  \App\Models\Membership  $membership
     * @return \Inertia\Response
     */
    public function browse(Schedule $schedule, User $users, ScheduleService $scheduleService)
    {
        return Inertia::render('Meetings/Schedule', [
            'title' => 'Meeting Schedule',
            'upcoming' => $scheduleService->upcoming(),
            'members' => $users->currentMember()->with('scheduleSuggestions')->get(),
            'schedule' => $schedule->current(),
            'currentUser' => Auth::user(),
        ]);
    }

    /**
     * Update availability
     *
     * @param  \App\Http\Requests\StoreScheduleAvailability  $request
     * @param string id
     * @return \Illuminate\Http\Response
     */
    public function updateAvailability(Request $request)
    {

        $request->validate([
            'availability' => 'string|required',
        ]);

        if (isset($request->updateDates)) {
            foreach ($request->updateDates as $date) {
                Schedule::where('date', Carbon::parse($date)->format('Y-m-d H:i:s'))
                    ->where('user_id', Auth::id())
                    ->first()
                    ->update(['availability' => $request->availability]);
            }
        }

        if (isset($request->addDates)) {
            foreach ($request->addDates as $date) {
                $newSchedule = new Schedule;
                $newSchedule->date = $date;
                $newSchedule->user_id = Auth::id();
                $newSchedule->availability = $request->availability;
                $newSchedule->save();
            }
        }

        $schedule = new Schedule;

        return response()->json(
            $schedule->current()
        );
    }

    /**
     * Create a suggestion
     *
     * @param  \App\Http\Requests\StoreScheduleSuggestionRequest  $request
     * @return \Illuminatee\Http\Response
     */
    public function addSuggestion(Request $request)
    {

        if (ScheduleSuggestion::where('suggested_date', $request->suggested_date)->get()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'A suggestion already exists for this date',
            ], 400);
        }

        $scheduleSuggestion = new ScheduleSuggestion;
        $scheduleSuggestion->suggested_date = $request->suggested_date;
        $scheduleSuggestion->user_id = Auth::id();
        $scheduleSuggestion->save();

        return response()->json([
            'id' => $scheduleSuggestion->id,
        ]);
    }

    /**
     * Delete a suggestion
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function removeSuggestion(Request $request, ScheduleSuggestion $scheduleSuggestion)
    {
        $scheduleSuggestion::destroy($request->id);
    }
}
