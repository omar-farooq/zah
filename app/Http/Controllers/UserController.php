<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Rent;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(User $user, Request $request)
    {
        if($request->memberCount == 'true') {
            return response()->json(
                $user->currentMember()->get()->count()
            );
        } elseif ($request->filter == 'none') {
            return response()->json(
                $user->orderByDesc('created_at')->get()
            );
        } elseif ($request->filter == 'tenants') {
            return response()->json(
                $user->where('is_tenant', 1)->get()
            );
        } elseif ($request->filter == 'members') {
            return response()->json(
                $user->currentMember()->get()
            );
        } else {
            return Inertia::render('Users/Manage', [
                'title' => 'Manage Users'
            ]);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        if($request->attribute == 'rent') {
            $user->rent->update($request->all());
        }

        if($request->attribute == 'is_tenant') {
            if($request->is_tenant == 0) {
                $user->rent->delete();
            } else { 
                $rent = new Rent;
                $rent->user_id = $user->id;
                $rent->amount = $request->amount;
                $rent->save();
            }

            $user->update($request->all());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
