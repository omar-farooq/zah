<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMeetingRequest;
use App\Http\Requests\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\MeetingAgenda;
use App\Models\MeetingAttendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Meeting $meeting, Request $request)
    {
        if(isset($request->getMeetings) && $request->getMeetings === 'true') {
            return response()->json(
                $meeting->where('cancelled',1)->orWhere('completed',1)->paginate(10)
            );
        } else if (isset($request->search)) {
            $result = Meeting::with('minutes', 'polls')->whereRelation('minutes', 'minute_text', 'like', '%'.$request->search.'%')
                            ->orWhereRelation('polls', 'name', 'like', '%'.$request->search.'%')
                            ->get();
            return response()->json($result);
        } else {
            return Inertia::render('Meetings/Index', [
                'title' => 'Previous Minutes',
                'meetingsPageOne' => $meeting->where('cancelled',1)->orWhere('completed',1)->paginate(10)
            ]);
        }
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
                'title' => 'Meeting',
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
        return Inertia::render('Meetings/View', [
            'title' => 'Historical Meeting',
            'meeting' => $meeting->load(['meetingAgenda','minutes', 'attendees', 'secretaryReport', 'polls'])
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
        MeetingAgenda::where('meeting_id', NULL)->update(['meeting_id' => $meeting->id]);
        $meeting->update(['completed' => 1]);
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
     *
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function markAttendance (Request $request) {
        if(!empty($request->Attendees)) {
            foreach($request->Attendees as $attendee) {
                $meetingAttendance = new MeetingAttendance;
                $meetingAttendance->user_id = $attendee['value'];
                $meetingAttendance->meeting_id = $request->meetingID;
                $meetingAttendance->save();
            }
        }

        if(!empty($request->LateAttendees)) {
            foreach($request->LateAttendees as $attendee) {
                $meetingAttendance = new MeetingAttendance;
                $meetingAttendance->user_id = $attendee['value'];
                $meetingAttendance->meeting_id = $request->meetingID;
                $meetingAttendance->late = 1;
                $meetingAttendance->save();
            }
        }

        if(!empty($request->Guests)) {
            foreach($request->Guests as $guest) {
                $meetingAttendance = new MeetingAttendance;
                $meetingAttendance->name = $guest['value'];
                $meetingAttendance->meeting_id = $request->meetingID;
                $meetingAttendance->guest = 1;
                $meetingAttendance->save();
            }
        }

    }

}
