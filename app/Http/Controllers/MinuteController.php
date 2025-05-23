<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Minute;
use Illuminate\Http\Request;

class MinuteController extends Controller
{
    /**
     * Display Minutes for each meeting.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Minute $minute, Request $request)
    {
        if ($request->has('latest')) {
            $meeting = new Meeting;
            $last_meeting = $meeting->where('cancelled', 0)
                ->where('completed', 1)
                ->latest('time_of_meeting')
                ->first()
                                    ->id;

            return response()->json(
                $minute->where('meeting_id', $last_meeting)
                    ->get()
            );
        } else {
            return response()->json([
                'minutes' => $minute->where('meeting_id', $request->meeting_id)->get(),
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreMinuteRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newMinute = Minute::create($request->all());

        return response()->json([
            'id' => $newMinute->id,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Minute $minute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Minute $minute)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMinuteRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Minute $minute)
    {
        $minute->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Minute::destroy($id);
    }
}
