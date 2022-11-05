<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMeetingRequest;
use App\Http\Requests\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\User;
use Inertia\Inertia;

class MeetingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Meeting $meeting)
    {
        return Inertia::render('Meetings/ListMinutes', [
            'meetings' => $meeting->where('cancelled',1)->orWhere('completed',1)->get()
        ]);
    }

    /**
     * Schedule the meeting
     *
     * @param  \App\Http\Requests\StoreMeetingRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMeetingRequest $request)
    {
        $meeting = new Meeting;
		$meeting->time_of_meeting = $request->time;
		$meeting->save();
		return response()->json([
			'id' => $meeting->id
		]);
    }

    /**
     * The Meeting
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Meeting $meeting, User $user)
    {
        if ($meeting->scheduledNotYetStarted() == null) {
            return Inertia::render('Meetings/NotYetScheduled');
        } else {
            return Inertia::render('Meetings/Edit', [
                'meeting' => $meeting->scheduledNotYetStarted(),
                'tenants' => $user->where('is_tenant',1)->get()->map(function($user, $key) {
                    return [
                        'value' => $user->id,
                        'label' => $user->name
                    ];
                })
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function show(Meeting $meeting)
    {
        return Inertia::render('Meetings/Historical', [
            'meeting' => $meeting->load(['meetingAgenda','minutes', 'attendees'])
        ]);
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

}
