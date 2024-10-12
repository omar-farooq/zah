<?php

namespace App\Services;

use App\Models\Meeting;
use App\Models\MeetingAgenda;
use Carbon\Carbon;

class AgendaService
{
    public function meetingIDFromLaterThan($time)
    {
        $existingMeetings = new Meeting;
        //check if there are upcoming meetings
        if (count($existingMeetings->allUpcoming()) > 0) {
            $UpcomingMeeting = $existingMeetings->firstUpcoming();
            if (Carbon::parse($UpcomingMeeting->time_of_meeting)->gt($time)) {
                return $UpcomingMeeting->id;
            }
        }

    }

    /*
     *
     */
    public function attachToNewMeeting($newMeetingId, $oldMeetingId)
    {
        MeetingAgenda::where('meeting_id', null)->update(['meeting_id' => $newMeetingId]);
        if (isset($oldMeetingId)) {
            MeetingAgenda::where('meeting_id', $oldMeetingId)->update(['meeting_id' => $newMeetingId]);
        }

    }

    public function detachFromMeeting($meetingId)
    {
        $newMeeting = new Meeting;
        $newMeetingId = $newMeeting->firstUpcoming()->id ?? null;
        MeetingAgenda::where('meeting_id', $meetingId)->update(['meeting_id' => $newMeetingId]);

    }
}
