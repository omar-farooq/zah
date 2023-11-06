<?php

namespace App\Http\Controllers;

use App\Models\RuleSection;
use Illuminate\Http\Request;

class RuleSectionController extends Controller
{
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
    public function store($title)
    {
        $last_section_number = RuleSection::all()->sortBy('number')->last()->number;
        $new_section_number = $last_section_number + 1;

        $ruleSection = new RuleSection;
        $ruleSection->title = $title;
        $ruleSection->number = $new_section_number;
        $ruleSection->save();
        return $ruleSection->id;
    }

    /**
     * Display the specified resource.
     */
    public function show(RuleSection $ruleSection)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RuleSection $ruleSection)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RuleSection $ruleSection)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RuleSection $ruleSection)
    {
        //
    }
}
