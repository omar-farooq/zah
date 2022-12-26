<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreVoteRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $vote = Vote::Create($request->all());
        return response()->json([
            'voteId' => $vote->id,
            'optionId' => $vote->poll_option_id
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateVoteRequest  $request
     * @param  \App\Models\Vote  $vote
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Vote $vote)
    {
        $vote->update($request->all());
        return response()->json([
            'voteId' => $vote->id,
            'optionId' => $vote->poll_option_id
        ]);
    }
}
