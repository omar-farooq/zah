<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'start_date', 'end_date'];
    protected $dates = ['created_at', 'updated_at', 'start_date', 'end_date'];

	public function user() 
	{
		return $this->belongsTo(User::class);
	}

    public function getMembers() 
    {
		return $this->where('end_date', null)->with('user')->get();
	}
}
