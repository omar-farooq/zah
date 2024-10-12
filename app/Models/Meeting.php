<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use BroadcastsEvents, HasFactory;

    protected $fillable = [
        'cancelled',
        'completed',
        'notes',
    ];

    protected $casts = [
        'time_of_meeting' => 'datetime',
    ];

    /**
     * Get the channels that the model should be broadcast on
     *
     * @param  string  $event
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn($event)
    {
        return [new PrivateChannel('meeting')];
    }

    public function getTimeOfMeetingAttribute($date)
    {
        //Get the date in the format Day of Week Month DD
        return Carbon::parse($date)->timezone('Europe/London')->format('l F d Y H:i');
    }

    public function allUpcoming()
    {
        return $this->where('time_of_meeting', '>', Carbon::now('Europe/London'))->orderBy('time_of_meeting', 'asc')->get();
    }

    public function firstUpcoming()
    {
        return $this->where('time_of_meeting', '>', Carbon::now('Europe/London'))->orderBy('time_of_meeting', 'asc')->first();
    }

    public function scheduledNotYetStarted()
    {
        return $this->where('completed', 0)->where('cancelled', 0)->orderBy('time_of_meeting', 'asc')->first();
    }

    public function meetingAgenda()
    {
        return $this->hasMany(MeetingAgenda::class);
    }

    public function minutes()
    {
        return $this->hasMany(Minute::class);
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'meeting_attendances')->withPivot('late');
    }

    public function guests()
    {
        return $this->hasMany(MeetingGuest::class);
    }

    public function polls()
    {
        return $this->hasMany(Poll::class);
    }

    public function secretaryReport()
    {
        return $this->hasOne(SecretaryReport::class);
    }
}
