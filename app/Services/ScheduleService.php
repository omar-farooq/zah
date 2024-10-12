<?php

namespace App\Services;

class ScheduleService
{
    /**
     * Date is suggested; Update the database.
     *
     * @param  string  $userid
     * @param  date  $suggest_date
     * @return $suggestion
     */
    public function addSuggestion() {}

    /**
     * Determine if there's an upcoming meeting
     *
     * @param  \App\Models\Meeting  $meeting
     * @return array
     */
    public function upcoming()
    {
        $meeting = new \App\Models\Meeting;
        if ($meeting->firstUpcoming() == null) {
            $upcomingDate = 'null';
            $upcomingID = -1;
            $upcomingStatus = 'unscheduled';
        } else {
            $upcomingDate = $meeting->firstUpcoming()->time_of_meeting;
            $upcomingID = $meeting->firstUpcoming()->id;
            $upcomingStatus = $meeting->firstUpcoming()->cancelled;
        }

        return ['id' => $upcomingID, 'date' => $upcomingDate, 'status' => $upcomingStatus];
    }
}
