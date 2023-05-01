<?php

namespace App\Http\Controllers;

use App\Models\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Rules/index', [
            'title' => 'Rules',
            'rules' => Rule::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Rules/Create', [
            'title' => 'Create a rule',
            'pending' => Rule::where('approval_status', 'in voting')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'rule_number' => 'required|decimal:1,2',
            'rule' => 'required'
        ]);

        //Check if the rule number already exists
        $existing_rule = Rule::where('rule_number', $request->rule_number)
                              ->whereNot(function ($q) {
                                  $q->where('approval_status', 'rejected');
                              })
                              ->count();
        if($existing_rule > 0) {
            return response()->json([
                'success' => 'false',
                'message' => 'rule number already exists'
            ],409);
        }

        $rule = new Rule;
        $created = $rule->create($request->all());

        if($created) {
            return response()->json([
                'success' => 'true',
                'message' => 'rule successfully created for voting',
                'createdRule' => $created
            ],200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Rule $rule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rule $rule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rule $rule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rule $rule)
    {
        //
    }

    public function approved($id) {
        $approve_rule = Rule::findOrFail($id);
        $approve_rule->updated(['approval_status' => 'approved']);
        return response()->json('approved');
    }
}
