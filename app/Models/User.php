<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
        'phone',
        'avatar',
        'is_tenant',
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
     * The model that should be included with the user
     *
     * @var array<int, string>
     */
    protected $with = [
        'membership',
        'role',
        'delegatedRole',
        'rent',
    ];

    /**
     * Relationship with Schedule Suggestions
     */
    public function scheduleSuggestions()
    {
        return $this->hasMany(ScheduleSuggestion::class)->where('suggested_date', '>', Carbon::now('Europe/London'));
    }

    /**
     * Relationship with Membership
     */
    public function membership()
    {
        return $this->hasOne(Membership::class);
    }

    /**
     * Relationship with Meeting Agends
     */
    public function meetingAgendas()
    {
        return $this->hasMany(MeetingAgenda::class);
    }

    /**
     * Relationship with Purchase Requests
     */
    public function purchaseRequests()
    {
        return $this->hasMany(PurchaseRequest::class);
    }

    /**
     * Relationship with Maintenance Requests
     */
    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    /**
     * Relationship with Tasks
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Relationship with Roles
     */
    public function role()
    {
        return $this->hasOne(Role::class);
    }

    /**
     * Relationship with Delegated Roles
     */
    public function delegatedRole()
    {
        return $this->hasOne(DelegatedRole::class);
    }

    /**
     * Relationship with Rent Arrears
     */
    public function rentArrear()
    {
        return $this->hasOne(RentArrear::class);
    }

    /**
     * Relationship with Approvals
     */
    public function approvals()
    {
        return $this->hasMany(Approval::class);
    }

    /**
     * Relationship with Comments
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Relationship with Meeting Attendances
     */
    public function attendance()
    {
        return $this->belongsToMany(Meeting::class, 'meeting_attendances')->withPivot('late');
    }

    /**
     * Relationship with Secretary Reports
     */
    public function secretaryReports()
    {
        return $this->hasMany(SecretaryReport::class);
    }

    /**
     * Relationship with Treasury Plans
     */
    public function treasuryPlans()
    {
        return $this->hasMany(TreasuryPlan::class);
    }

    /**
     * Relationship with Rent
     */
    public function rent()
    {
        return $this->hasOne(Rent::class);
    }

    /**
     * Get Members
     **/
    public function currentMember()
    {
        return $this->with('membership')->whereHas('membership', function ($query) {
            $query->whereNull('end_date');
        });
    }

    /**
     * Get Next Of Kin
     */
    public function nextOfKin()
    {
        return $this->hasOne(NextOfKin::class);
    }
}
