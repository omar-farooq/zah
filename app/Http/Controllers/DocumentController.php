<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Document $document, Request $request)
    {
        if($request->has('meeting_id')) {
            return response()->json(Document::where('meeting_id', $request->query('meeting_id'))->get());
        } elseif ($request->has('all')) {
            $searchTerm = $request->query('search');            
            return response()->json(
                $document->where('description', 'like', '%'.$searchTerm.'%')
                ->orderBy('created_at', 'desc')
                ->paginate(50)
            );
        } else {
            return Inertia::render('Documents/Browse', [
                'title' => 'Download Documents',
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Documents/Upload', [
            'title' => 'Upload Documents',
        ]);
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
        $storage_name = 'Zah_Document_' . date('YmdHis') . "." . $ext;

        //upload
        try {
            Storage::disk('s3')->putFileAs('/documents/general', $request->file('attachment'), $storage_name);
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
        $document->meeting_id = $request->meeting_id ?? NULL;
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
        return Storage::disk('s3')->download('documents/general/' . $document->upload_name);
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
            Storage::disk('s3')->delete('/documents/general/'.$document->upload_name);
            $document->delete();
        }
    }
}
