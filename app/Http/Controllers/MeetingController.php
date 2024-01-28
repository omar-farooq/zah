<?php

namespace App\Http\Controllers;

use App\Events\AttendanceUpdated;
use App\Events\GuestListUpdated;
use App\Http\Requests\StoreMeetingRequest;
use App\Http\Requests\UpdateMeetingRequest;
use App\Jobs\Notification;
use App\Models\Meeting;
use App\Models\MeetingAgenda;
use App\Models\MeetingAttendance;
use App\Models\MeetingGuest;
use App\Models\Minute;
use App\Models\SecretaryReport;
use App\Models\Poll;
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
        //Need to send to everyone separately
        Notification::dispatch('meeting scheduled', 'meeting has been schedule', config('zah.email-address'));
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
                'meeting' => $meeting->scheduledNotYetStarted()->load(['attendees', 'guests']),
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
        SecretaryReport::where('meeting_id', NULL)->update(['meeting_id' => $meeting->id]);
        Minute::where('meeting_id', NULL)->update(['meeting_id' => $meeting->id]);
        Poll::where('meeting_id', NULL)->update(['meeting_id' => $meeting->id]);

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
        $meeting->update(['cancelled' => 1]);
    }

    /**
     *
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function registerAttendance(Request $request) {
        $allAttendees = [];

        foreach($request->attendees as $punctual) {
            $allAttendees[$punctual] = ['late' => false];
        }

        forEach($request->lateAttendees as $late) {
            $allAttendees[$late] = ['late' => true];
        }

        $meeting = Meeting::find($request->meetingID);
        $meeting->attendees()->sync($allAttendees);

        $lateAttendees = $meeting->attendees()->where('meeting_attendances.late', '1')->select('name', 'user_id')->get();
        $punctualAttendees = $meeting->attendees()->where('meeting_attendances.late', '0')->select('name', 'user_id')->get();

        AttendanceUpdated::dispatch($lateAttendees, $punctualAttendees);

    }

    public function registerGuest(Request $request) {
        $meeting = Meeting::find($request->meetingID);
        $registered_guests = MeetingGuest::where('meeting_id', $request->meetingID)->get();
        forEach($registered_guests as $registered_guest) {
            if(!in_array($registered_guest, $request->guests)) {
                $registered_guest->delete(); 
            }
        }

        forEach($request->guests as $guest) {
            if(!$registered_guests->contains($guest)) {
                $meetingGuest = new MeetingGuest;
                $meetingGuest->name = $guest;
                $meetingGuest->meeting_id = $request->meetingID;
                $meetingGuest->save();
            }
        }

        $updatedGuests = MeetingGuest::where('meeting_id', $request->meetingID)->get();
        GuestListUpdated::dispatch($updatedGuests);
    }

}
