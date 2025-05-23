<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollOption;
use Illuminate\Http\Request;

class PollController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Poll $poll, Request $request)
    {
        if (isset($request->meeting) && $request->meeting == 'current') {
            return response()->json([
                'polls' => $poll->where('meeting_id', $request->meeting_id)->get(),
            ]);
        }

        $id = $request->get('id');
        $attribute = $request->get('attribute');
        $query = Poll::query();
        if ($id) {
            if ($attribute == 'poll_items') {
                $results = PollOption::where('poll_id', $id)->get();
            } else {
                $results = $query->where('id', $id)->get();
            }

            return response()->json(
                $results
            );
        } else {
            return response()->json(
                $poll->all()
            );
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $poll = new Poll;
        $poll->name = $request->title;
        $poll->poll_end = $request->end;
        $poll->save();

        foreach ($request->options as $option) {
            $poll->pollItems()->create($option);
        }
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
        $poll = Poll::where('id', $id)->first();
        $poll->delete();
    }
}
