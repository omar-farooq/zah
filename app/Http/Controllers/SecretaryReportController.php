<?php

namespace App\Http\Controllers;

use App\Models\SecretaryReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        if($request->file('attachment')) {
            $reportName = 'Secretary_Report_' . date('Ymd') . '.pdf';
            Storage::putFileAs('documents/secretary_reports', $request->file('attachment'), $reportName);
            $newReport['attachment'] = $reportName;
            $newReport->save();
        }

        return response()->json([
            'id' => $newReport->id,
            'uploaded_report' => $reportName,
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
    public function show(Request $request, SecretaryReport $secretaryReport)
    {
        if($request->query('type') == 'view') {
            return Storage::get('documents/secretary_reports/' . $secretaryReport->attachment);
        }else if($request->query('type') == 'download') {
            return Storage::download('documents/secretary_reports/' . $secretaryReport->attachment);
        } else {
            return;
        }
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
