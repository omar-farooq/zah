<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentArrear extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function currentTenant() {
        return $this->whereHas('user', function($q){
            $q->where('is_tenant', 1);
        });
    }
}
