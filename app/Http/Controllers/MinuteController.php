<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreMinuteRequest;
use App\Http\Requests\UpdateMinuteRequest;
use App\Models\Minute;

class MinuteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Minute $minute)
    {
        return response()->json([
            'minutes' => $minute->all()
        ]);
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
     * @param  \App\Http\Requests\StoreMinuteRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newMinute = Minute::create($request->all());
        return response()->json([
            'id' => $newMinute->id,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Minute  $minute
     * @return \Illuminate\Http\Response
     */
    public function show(Minute $minute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Minute  $minute
     * @return \Illuminate\Http\Response
     */
    public function edit(Minute $minute)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMinuteRequest  $request
     * @param  \App\Models\Minute  $minute
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMinuteRequest $request, Minute $minute)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Minute::destroy($id);
    }
}
