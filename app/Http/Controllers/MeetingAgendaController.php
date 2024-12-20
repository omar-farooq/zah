<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingAgenda;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingAgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param App\Models\MeetingAgenda
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, MeetingAgenda $agenda)
    {
        if ($request->query('meeting_id')) {
            return response()->json([
                'agenda' => $agenda->where('meeting_id', $request->query('meeting_id'))->get(),
            ]);
        }

        return response()->json([
            'agenda' => $agenda->whereNull('meeting_id')->get(),
        ]);
    }

    /**
     * Display upcoming agenda only.
     * This is so that the in progress meeting can continue until submitted and items can still be added to the next meeting agenda.
     *
     * @param App\Models\MeetingAgenda
     * @return \Illuminate\Http\Response
     */
    public function upcoming(Request $request)
    {
        $meeting = new Meeting;
        $upcomingMeetingId = $meeting->firstUpcoming()->id ?? null;

        return Inertia::render('Meetings/Agenda', [
            'title' => 'Agenda for the next meeting',
            'meetingId' => $upcomingMeetingId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newAgenda = Auth::User()->meetingAgendas()->create($request->all());

        return response()->json([
            'id' => $newAgenda->id,
            'user_id' => $newAgenda->user_id,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        MeetingAgenda::destroy($id);
    }
}
