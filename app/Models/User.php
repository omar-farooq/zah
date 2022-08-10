<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

	/**
	 * Relationship with Schedule Suggestions
	 *
	 */
	 public function scheduleSuggestions() {
		return $this->hasMany(ScheduleSuggestion::class)->where('suggested_date', '>', Carbon::now('Europe/London'));
	 }

	 /**
	 * Relationship with Membership
	 *
	 *
	 */
	 public function membership() {
		return $this->hasOne(Membership::class);
	 }

	/**
	 * Get Members
	 *
     *
	**/
	public function currentMember() {
		return $this->with('membership')->whereHas('membership', function($query){
			$query->whereNull('end_date');
		});
	}
}
