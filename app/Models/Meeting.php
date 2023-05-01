<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Meeting extends Model

{
    use HasFactory;
    protected $fillable = [
        'cancelled',
        'completed',
        'notes',
    ];
    protected $casts = [
        'time_of_meeting' => 'datetime'
    ];

	public function getTimeOfMeetingAttribute($date) {
		//Get the date in the format Day of Week Month DD 
		return Carbon::parse($date)->timezone('Europe/London')->format('l F d Y H:i');
	}

	public function findUpcoming() {
		return $this->where('time_of_meeting', '>', Carbon::now('Europe/London'))->orderBy('time_of_meeting', 'asc')->first();		
    }

    public function scheduledNotYetStarted() {
        return $this->where('completed',0)->where('cancelled',0)->orderBy('time_of_meeting','asc')->first();
    }

    public function meetingAgenda() {
        return $this->hasMany(MeetingAgenda::class);
    }

    public function minutes() {
        return $this->hasMany(Minute::class);
    }

    public function attendees() {
        return $this->belongsToMany(User::class, 'meeting_attendances')->withPivot('late');
    }

    public function guests() {
        return $this->hasMany(MeetingGuest::class);
    }

    public function polls() {
        return $this->hasMany(Poll::class);
    }

    public function secretaryReport() {
        return $this->hasOne(SecretaryReport::class);
    }
}
