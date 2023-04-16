<?php

namespace App\Http\Controllers;

use Auth;
use App\Models\User;
use App\Models\Rent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
    public function show(Request $request, $id)
    {
        if($request->query('view') && $request->query('view') == 'avatar') {
            $avatar = User::where('id', $id)->first()->avatar;
            return Storage::disk('spaces')->get('avatars/'.$avatar);
        } else {
            return Inertia::render('Users/Profile', [
                'title' => 'User Profile',
                'user' => User::find($id)
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        $current_user_id = Auth::id();
        if($current_user_id !== $user->id) {
            abort(403);
        }
        $current_user = User::where('id', $current_user_id)->with('nextOfKin')->first();
        return Inertia::render('Users/EditProfile', [
            'title' => 'Edit Profile',
            'user' => $current_user
        ]);
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
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string'
        ]);
        if($user->id !== Auth::id()) {
            abort(403);
        }        

        $user->update($request->except(['avatar']));

        if($request->file('avatar')) {
            $avatarName = str_replace('@', '_', $user->email) . '_avatar.' . $request->file('avatar')->extension();
            Storage::disk('spaces')->putFileAs('avatars', $request->file('avatar'), $avatarName);
            $user->update(['avatar' => $avatarName]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'updated your profile',
        ]);

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
