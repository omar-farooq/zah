<?php

namespace App\Http\Controllers;

use App\Mail\ContactForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactFormController extends Controller
{
    public function generateEmail(Request $request) {
        $recipient = config('zah.email-address');
        Mail::to($recipient)->send(new ContactForm($request->name, $request->email, $request->comments));
    }
}
