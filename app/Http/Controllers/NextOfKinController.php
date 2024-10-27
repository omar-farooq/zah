<?php

namespace App\Http\Controllers;

use App\Models\NextOfKin;
use Auth;
use Illuminate\Http\Request;

class NextOfKinController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        $next_of_kin = new NextOfKin;
        $next_of_kin->user_id = Auth::id();
        $next_of_kin->name = $request->name;
        $next_of_kin->email = $request->email;
        $next_of_kin->phone = $request->phone;
        $next_of_kin->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Updated Next Of Kin',
            'nextOfKin' => $next_of_kin,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NextOfKin $nextOfKin)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);
        $nextOfKin->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Updated Next Of Kin',
            'nextOfKin' => $nextOfKin,
        ]);
    }
}
