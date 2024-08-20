<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmail;
use App\Jobs\Notification;
use App\Models\User;
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

    public function notificationEmail($subject, $messageBody) {

        $users = new User;
        $members = $users->currentMember()->get(['email','name'])->toArray();
        foreach($members as $recipient) {
            Notification::dispatch($subject, $messageBody, $recipient);
        }
    }
}
