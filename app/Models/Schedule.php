<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Schedule extends Meeting
{
    use HasFactory;
	protected $table = 'schedule';

	public function current() {
		return $this->where('date', '>', Carbon::now('Europe/London')->subDays(6))->get();
	}
}
