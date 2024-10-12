<?php

namespace App\Http\Controllers;

use App\Models\PollOption;
use App\Models\Vote;
use Auth;
use Illuminate\Http\Request;

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
        if ($request->has('onBehalfOf')) {
            if (Auth::user()->role['name'] !== 'Chair') {
                return response()->json([
                    'message' => 'unauthorized',
                ], 401);
            }
            //find the poll currently voting in
            $pollId = PollOption::where('id', $request->poll_option_id)->first()->poll_id;

            //get all poll options
            $pollOptions = PollOption::where('poll_id', $pollId)->get();

            //loop through the options
            //and get existing votes by the user on that option
            //then delete that before creating a new vote
            foreach ($pollOptions as $pollOption) {
                $existingUserVotes = Vote::Where('poll_option_id', $pollOption['id'])->where('user_id', $request->user_id)->get();
                foreach ($existingUserVotes as $existingUserVote) {
                    $voteToDelete = Vote::find($existingUserVote->id);
                    $voteToDelete->delete();
                }
            }
        }
        $vote = Vote::Create($request->all());

        return response()->json([
            'voteId' => $vote->id,
            'optionId' => $vote->poll_option_id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateVoteRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Vote $vote)
    {
        $vote->update($request->all());

        return response()->json([
            'voteId' => $vote->id,
            'optionId' => $vote->poll_option_id,
        ]);
    }
}
