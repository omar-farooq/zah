<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Schedule extends Meeting
{
    use HasFactory;
	protected $table = 'schedule';
	protected $fillable = ['user_id', 'availability'];
	protected $casts = ['date' => 'datetime'];
	
	public $timestamps = false;

	public function getDateAttribute($date) {
		return Carbon::parse($date)->format('d/m/Y, H:i:s');
	}

	public function current() {
		return $this->where('date', '>', Carbon::now('Europe/London')->subDays(6))->get();
	}
}
