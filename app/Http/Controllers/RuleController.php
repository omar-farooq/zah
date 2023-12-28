<?php

namespace App\Http\Controllers;

use App\Http\Controllers\RuleSectionController;
use App\Models\Rule;
use App\Models\RuleSection;
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
            'ruleSections' => RuleSection::with(['rules' => function($q) {
                $q->where('approval_status', '=', 'approved')
                  ->with(['ruleChanges' => function($q2) {
                    $q2->where('approval_status', 'in voting');
                  }])
                  ->with(['ruleDeletes' => function($q3) {
                    $q3->where('approval_status', 'in voting');
                  }]);
            }])->get()
        ]);
    }

    /**
     * Show the form for creating a new resource and approvals section
     */
    public function create()
    {
        return Inertia::render('Rules/Create', [
            'title' => 'Create & approve rules',
            'pending' => Rule::with(['ruleSection'])->where('approval_status', 'in voting')->get(),
            'changeRequests' => Rule::with(['ruleSection','ruleChanges'])->whereRelation('ruleChanges', 'approval_status', '=', 'in voting')->get(),
            'deletions' => Rule::with(['ruleSection','ruleDeletes'])->whereRelation('ruleDeletes', 'approval_status', '=', 'in voting')->get(),
            'sections' => RuleSection::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'section' => 'required|array',
            'rule' => 'required'
        ]);

        $section_title = $request['section']['label'];
        $section_number = $request['section']['value'];

        //Check if the section is new and get the new id if creating, otherwise get the existing id
        if($section_number == 'newSection') {
            $existing_sections = RuleSection::where('title', $section_title)->count();
            if($existing_sections > 0) {
                return response()->json([
                    'success' => 'false',
                    'message' => 'section already exists'
                ],409);
            } else {
                $ruleSectionController = new RuleSectionController();
                $rule_section_id = $ruleSectionController->store($section_title);
                $section_number = RuleSection::where('id', $rule_section_id)->first()->number;
            }
        } else {
            $rule_section_id = RuleSection::where('title', $section_title)->first()->id;
        }
        
        $rule = new Rule;
        $rule->rule_section_id = $rule_section_id;
        $rule->rule = $request->rule;
        $created = $rule->save();
        $rule_id = $rule->id;

        if($created) {
            return response()->json([
                'success' => 'true',
                'message' => 'rule successfully created for voting',
                'createdRule' => $rule->rule,
                'ruleId' => $rule_id,
                'sectionTitle' => $section_title,
                'sectionNumber' => $section_number
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
        $approved_rule = Rule::findOrFail($id);
        $section_id = $approved_rule->rule_section_id;
        $rules_in_section = Rule::where('rule_section_id', $section_id)->get();
        $last_rule_in_section = $rules_in_section->sortBy('number')->last()->number;
        $new_rule_number = $last_rule_in_section + 1;

        $approved_rule->number = $new_rule_number;
        $approved_rule->save();

        return response()->json('approved');
    }
}
