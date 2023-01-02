<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rent extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount', 
        'user_id'
    ];
    
    /**
     * Relationship with the user
     */
    public function user() {
        return $this->belongsTo(User::class);
    }
}
