<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MeetingAgenda;
use Inertia\Inertia;
use Redirect;
use Auth;

class MeetingAgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param App\Models\MeetingAgenda
     *
     * @return \Illuminate\Http\Response
     */
    public function index(MeetingAgenda $agenda)
    {
        return response()->json([
            'agenda' => $agenda->where('meeting_id', '!=', NULL)->get()
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newAgenda = Auth::User()->meetingAgendas()->create($request->all());
        return response()->json([
            'id' => $newAgenda->id,
            'user_id' => $newAgenda->user_id
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
     * @param  \Illuminate\Http\Request  $request
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
