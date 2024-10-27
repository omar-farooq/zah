<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Meeting
{
    use HasFactory;

    protected $table = 'schedule';

    protected $fillable = ['user_id', 'availability'];

    protected $casts = ['date' => 'datetime'];

    public $timestamps = false;

    public function getDateAttribute($date)
    {
        return Carbon::parse($date)->format('d/m/Y, H:i:s');
    }

    public function current()
    {
        return $this->where('date', '>', Carbon::now('Europe/London')->subDays(6))->get();
    }
}
