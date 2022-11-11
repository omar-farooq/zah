<?php

namespace App\Http\Controllers;

use App\Models\SecretaryReport;
use Illuminate\Http\Request;
use Auth;

class SecretaryReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\SecretaryReport $secretaryReport
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, SecretaryReport $secretaryReport)
    {
        if($request->query('not-saved-in-meeting') == 'true') {
            $latestReport = $secretaryReport->where('meeting_id', NULL)->first();
            if($latestReport) {
                return response()->json(
                    $latestReport
                );
            }
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newReport = Auth::User()->secretaryReports()->create($request->all());
        return response()->json([
            'id' => $newReport->id,
            'status' => 'success',
            'message' => 'Report Created'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SecretaryReport  $secretaryReport
     * @return \Illuminate\Http\Response
     */
    public function show(SecretaryReport $secretaryReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SecretaryReport  $secretaryReport
     * @return \Illuminate\Http\Response
     */
    public function edit(SecretaryReport $secretaryReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SecretaryReport  $secretaryReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SecretaryReport $secretaryReport)
    {
        if($secretaryReport->meeting_id != null) {
            return response()->json([
                'status' => 'error',
                'message' => 'id mismatch'
            ],409);
        } else {
            $secretaryReport->update($request->all());
            return response()->json([
                'status' => 'success',
                'message' => 'Secretary\'s Report has been updated'
            ],200);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SecretaryReport  $secretaryReport
     * @return \Illuminate\Http\Response
     */
    public function destroy(SecretaryReport $secretaryReport)
    {
        //
    }
}
