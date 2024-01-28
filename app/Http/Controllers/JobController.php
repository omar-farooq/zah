<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmail;
use App\Jobs\Notification;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function generateEmail(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'comments' => 'required',
            'email' => 'required|email'
        ]);

        SendEmail::dispatch($request->name, $request->email, $request->comments);
    }

    public function notificationEmail(Request $request) {
        Notification::dispatch($request->$message, $request->subject, config('zah.email-address'));
    }
}
