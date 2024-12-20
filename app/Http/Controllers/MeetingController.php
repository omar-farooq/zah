<?php

namespace App\Http\Controllers;

use App\Events\AttendanceUpdated;
use App\Events\GuestListUpdated;
use App\Http\Requests\StoreMeetingRequest;
use App\Http\Requests\UpdateMeetingRequest;
use App\Models\Document;
use App\Models\Meeting;
use App\Models\MeetingAgenda;
use App\Models\MeetingGuest;
use App\Models\Minute;
use App\Models\Poll;
use App\Models\SecretaryReport;
use App\Models\User;
use App\Services\AgendaService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    /**
     * Instantiate the Agenda Service
     */
    public function __construct()
    {
        $this->agendaService = new AgendaService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Meeting $meeting, Request $request)
    {
        if (isset($request->getMeetings) && $request->getMeetings === 'true') {
            return response()->json(
                $meeting->where('completed', 1)->orderBy('time_of_meeting', 'desc')->paginate(10)
            );
        } elseif (isset($request->search)) {
            $result = Meeting::with('minutes', 'polls')->whereRelation('minutes', 'minute_text', 'like', '%'.$request->search.'%')
                ->orWhereRelation('polls', 'name', 'like', '%'.$request->search.'%')
                ->get();

            return response()->json($result);
        } else {
            return Inertia::render('Meetings/Index', [
                'title' => 'Previous Minutes',
                'meetingsPageOne' => $meeting->where('completed', 1)->orderBy('time_of_meeting', 'desc')->paginate(10),
            ]);
        }
    }

    /**
     * Schedule the meeting
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMeetingRequest $request)
    {
        //Check if the meeting has already been created
        $count = Meeting::where('time_of_meeting', $request->time)->count();
        if ($count > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'A meeting already exists for the requested time',
            ], 409);
        }

        //Check if there is a scheduled meeting starting later than the newly requested one and disassociate the agenda items if there is
        $laterMeeting = $this->agendaService->meetingIDFromLaterThan(Carbon::parse($request->time)->timezone('Europe/London'));

        //Create the meeting
        $meeting = new Meeting;
        $meeting->time_of_meeting = $request->time;
        $meeting->save();

        //attach the agenda to the meeting (so that the agenda can be added to for future meetings if the meeting is not yet submitted)
        $this->agendaService->attachToNewMeeting($meeting->id, $laterMeeting);

        //Send email to everyone
        $meeting_time = Carbon::parse($request->time)->setTimezone('Europe/London')->locale('uk')->format('l jS \\of F Y h:i A');
        $subject = 'new meeting scheduled';
        $messageBody = '<p>A new meeting has been scheduled for <b>'.$meeting_time."</b></p><p> If you haven't already added your availability to the schedule then please do so so that we know if you are going to attend</p>";
        app(JobController::class)->notificationEmail($subject, $messageBody);

        //Return response back to the front end
        return response()->json([
            'id' => $meeting->id,
        ]);
    }

    /**
     * The Meeting where people can join if it has started. If it's not yet started then it returns a different page with the agenda.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Meeting $meeting, User $user)
    {
        if ($meeting->scheduledNotYetStarted() == null) {
            return Inertia::render('Meetings/NotYetScheduled', [
                'meetingId' => $meeting->firstUpcoming() ? $meeting->firstUpcoming()->id : null,
            ]);
        } else {
            return Inertia::render('Meetings/Minutes', [
                'title' => 'Meeting',
                'meeting' => $meeting->scheduledNotYetStarted()->load(['attendees', 'guests']),
                'tenants' => $user->where('is_tenant', 1)->get()->map(function ($user, $key) {
                    return [
                        'value' => $user->id,
                        'label' => $user->name,
                    ];
                }),
            ]);
        }
    }

    /**
     * Show a meeting that has been already created and finished
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Meeting $meeting, Request $request)
    {
        if ($request->exists('getMinutesRead')) {
            return response()->json(
                $meeting->minutes_read_and_agreed
            );
        }

        return Inertia::render('Meetings/DisplayPrevious', [
            'title' => 'Historical Meeting',
            'meeting' => $meeting->load(['meetingAgenda', 'minutes', 'attendees', 'secretaryReport', 'polls', 'guests']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Meeting $meeting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMeetingRequest $request, Meeting $meeting)
    {
        if ($request->exists('updateMinutesRead')) {
            $meeting->minutes_read_and_agreed = $request->minutesReadAndAgreed;
            $meeting->save();
        } else {
            Document::where('meeting_id', null)->update(['meeting_id' => $meeting->id]);
            Minute::where('meeting_id', null)->update(['meeting_id' => $meeting->id]);
            Poll::where('meeting_id', null)->update(['meeting_id' => $meeting->id]);
            SecretaryReport::where('meeting_id', null)->update(['meeting_id' => $meeting->id]);

            //Meeting Agendas are now handled on a meeting by meeting basis (25/08/2024)
            //MeetingAgenda::where('meeting_id', NULL)->update(['meeting_id' => $meeting->id]);

            $meeting->update(['completed' => 1]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Meeting $meeting)
    {
        $meeting->update(['cancelled' => 1]);

        //Release the agenda from the meeting
        $this->agendaService->detachFromMeeting($meeting->id);

        //Send email to everyone
        $meeting_time = Carbon::parse($meeting->time_of_meeting)->locale('uk')->format('l jS \\of F Y \\a\\t h:i A');
        $subject = 'Meeting CANCELLED';
        $messageBody = '<p>This email is to notify you that the meeting on <b>'.$meeting_time.'</b> has been cancelled. Please do not attend.</p>';
        app(JobController::class)->notificationEmail($subject, $messageBody);
    }

    /**
     * @param  Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function registerAttendance(Request $request)
    {
        $allAttendees = [];

        foreach ($request->attendees as $punctual) {
            $allAttendees[$punctual] = ['late' => false];
        }

        foreach ($request->lateAttendees as $late) {
            $allAttendees[$late] = ['late' => true];
        }

        $meeting = Meeting::find($request->meetingID);
        $meeting->attendees()->sync($allAttendees);

        $lateAttendees = $meeting->attendees()->where('meeting_attendances.late', '1')->select('name', 'user_id')->get();
        $punctualAttendees = $meeting->attendees()->where('meeting_attendances.late', '0')->select('name', 'user_id')->get();

        AttendanceUpdated::dispatch($lateAttendees, $punctualAttendees);

    }

    public function registerGuest(Request $request)
    {
        $meeting = Meeting::find($request->meetingID);
        $registered_guests = MeetingGuest::where('meeting_id', $request->meetingID)->get();
        foreach ($registered_guests as $registered_guest) {
            if (! in_array($registered_guest, $request->guests)) {
                $registered_guest->delete();
            }
        }

        foreach ($request->guests as $guest) {
            if (! $registered_guests->contains($guest)) {
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
