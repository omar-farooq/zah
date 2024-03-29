<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmail;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function generateEmail(Request $request) {
        SendEmail::dispatch($request->name, $request->email, $request->comments);
    }
}
