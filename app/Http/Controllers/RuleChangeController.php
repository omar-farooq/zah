<?php

namespace App\Http\Controllers;

use App\Models\RuleChange;
use App\Models\Rule;
use Illuminate\Http\Request;

class RuleChangeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $request->validate([
            'rule' => 'required|string',
            'rule_id' => 'required|integer'
        ]);

        $existing_change_count = RuleChange::where('rule_id', $request->rule_id)->count();
        if($existing_change_count > 0) {
            return response()->json([
                'success' => 'false',
                'message' => 'There is already a change for this rule'
            ],409);
        } else {
            RuleChange::create($request->all());
            return response()->json([
                'success' => 'true',
                'message' => 'Rule change has entered voting'
            ],200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RuleChange $ruleChange)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RuleChange $ruleChange)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id)
    {
        $rule_change = RuleChange::where('id', $id)->first();
        $rule = Rule::where('id', $rule_change->rule_id)->first();

        $rule->rule = $rule_change->rule;
        $rule->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RuleChange $ruleChange)
    {
        //
    }
}
