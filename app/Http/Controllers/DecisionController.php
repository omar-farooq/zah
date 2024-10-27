<?php

namespace App\Http\Controllers;

use App\Models\Decision;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DecisionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Decision $decision, Request $request)
    {
        if ($request->has('index')) {
            if ($request->has('getDecisions')) {
                return response()->json(Decision::where($decision->paginate(10)));
            } elseif ($request->has('search')) {
                return response()->json(Decision::where('decision_text', 'like', '%'.$request->search.'%')->get());
            } else {
                return Inertia::render('House/Decisions', [
                    'title' => 'Decisions Made',
                    'decisionsPageOne' => $decision->paginate(10),
                ]);
            }
        } elseif ($request->has('latest')) {
            $meeting = new Meeting;
            $last_meeting = $meeting->where('cancelled', 0)
                ->where('completed', 1)
                ->latest('time_of_meeting')
                ->first()
                          ->id;

            return response()->json(
                $decision->where('meeting_id', $last_meeting)
                    ->get()
            );
        } else {
            return response()->json([
                'decisions' => $decision->where('meeting_id', $request->meeting_id)->get(),
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $newDecision = Decision::create($request->all());

        return response()->json([
            'id' => $newDecision->id,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Decision $decision)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Decision $decision)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Decision $decision)
    {
        $decision->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Decision::destroy($id);
    }
}
