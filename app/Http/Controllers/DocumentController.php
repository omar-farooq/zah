<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Document::where('meeting_id', NULL)->get());
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
            'attachment' => 'file|mimes:pdf,jpg,png,gif',
            'description' => 'string'
        ]);

        $original_name = $request->file('attachment')->getClientOriginalName();
        $ext = $request->file('attachment')->extension();
        $storage_name = 'Meeting_Document_' . date('Ymd') . "." . $ext;

        //upload
        try {
            Storage::disk('s3')->putFileAs('/documents/meetings', $request->file('attachment'), $storage_name);
        } 
        catch(\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'issue moving to storage'
            ],400);
        }

        //add to the database
        $document = new Document;
        $document->description = $request->description;
        $document->original_name = $original_name;
        $document->upload_name = $storage_name;
        $document->user_id = Auth::id();
        $document->save();

        return response()->json([
            'status' => 'success',
            'message' => 'uploaded'
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        return Storage::disk('s3')->download('documents/meetings/' . $document->upload_name);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Documents $documents)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Documents $documents)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        if($document->user_id === Auth::id()) {
            Storage::disk('s3')->delete('/documents/meetings/'.$document->upload_name);
            $document->delete();
        }
    }
}
