<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMeetingRequest;
use App\Http\Requests\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\Membership;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MeetingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreMeetingRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMeetingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function show(Meeting $meeting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function edit(Meeting $meeting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMeetingRequest  $request
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMeetingRequest $request, Meeting $meeting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function destroy(Meeting $meeting)
    {
        //
    }

	/**
	* Find Upcoming Meeting and display
	*
	*@param \App\Models\Meeting $meeting
	*@return \Illuminate\Http\Response
	*/
	public function getUpcoming(Meeting $meeting)
	{
		$now = Carbon::now('Europe/London');
		$find_upcoming = $meeting->where('time_of_meeting', '>', $now)->first();
		$memberships = Membership::where('end_date', null)->with('user')->get();

		$schedule = DB::table('schedule')->get();

		if($find_upcoming == null){ 
			$upcoming = 'null';
			$upcomingID = -1;
		} else {
			$upcoming =  Carbon::parse($find_upcoming->time_of_meeting)->format('l F d Y');
			$upcomingID = $meeting->where('time_of_meeting', '>', $now)->first()->id;
		}

		return Inertia::render('Meetings/Upcoming', [
			'upcoming' => $upcoming,
			'id' => $upcomingID,
			'memberships' => $memberships,
			'schedule' => $schedule
		]);
	}
}
