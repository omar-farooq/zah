<?php

namespace App\Http\Controllers;

use App\Models\Rule;
use App\Models\RuleChange;
use App\Models\RuleDelete;
use Illuminate\Http\Request;

class RuleDeleteController extends Controller
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
            'rule_id' => 'required|integer'
        ]);

        $existing_delete_count = RuleDelete::where('rule_id', $request->rule_id)->count();
        $existing_change_count = RuleChange::where('rule_id', $request->rule_id)->count();

        if($existing_change_count > 0 || $existing_delete_count > 0) {
            return response()->json([
                'success' => 'false',
                'message' => 'The rule already has a change pending voting'
            ],409);
        } else {
            RuleDelete::create($request->all());
            return response()->json([
                'success' => 'true',
                'message' => 'Rule deletion is in voting'
            ],200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RuleDelete $ruleDelete)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RuleDelete $ruleDelete)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RuleDelete $ruleDelete)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //find which rule to delete
        $rule_delete = RuleDelete::where('id', $id)->first();
        $rule = Rule::findOrFail($rule_delete->rule_id);

        //get the section and number of the rule before deleting
        $deleted_rule_number = $rule->number;
        $deleted_rule_section = $rule->rule_section_id;

        //delete the rule
        $rule->delete();

        //decrease the rule number of all rules in the same section with a higher rule number
        $newer_rules = Rule::where('rule_section_id', $deleted_rule_section)
                            ->where('number', '>', $deleted_rule_number)
                            ->get();

        foreach($newer_rules as $newer_rule) {
            $newer_rule_number_new_number = $newer_rule->number - 1;
            $newer_rule->number = $newer_rule_number_new_number;
            $newer_rule->save();
        }
    }
}
