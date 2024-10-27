<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        if ($request->memberCount == 'true') {
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
                'title' => 'Manage Users',
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $random_password = Hash::make(Str::random(8));
        $new_user = User::create(['name' => $request->name, 'email' => $request->email, 'password' => $random_password]);
        app('App\Http\Controllers\Auth\PasswordResetLinkController')->store($request);

        return $new_user;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        if ($request->query('view') && $request->query('view') == 'avatar') {
            $avatar = User::where('id', $id)->first()->avatar;
            if (! isset($avatar) || $avatar === null || $avatar === '') {
                return Storage::disk('local')->get('/avatars/blankavatar.webp');
            } else {
                return Storage::get('avatars/'.$avatar);
            }
        } else {
            return Inertia::render('Users/Profile', [
                'title' => 'User Profile',
                'user' => User::where('id', $id)->with('nextOfKin')->first(),
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
        if ($current_user_id !== $user->id) {
            abort(403);
        }
        $current_user = User::where('id', $current_user_id)->with('nextOfKin')->first();

        return Inertia::render('Users/EditProfile', [
            'title' => 'Edit Profile',
            'user' => $current_user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
        ]);
        if ($user->id !== Auth::id()) {
            abort(403);
        }
        $previous_avatar = $user->avatar;

        $user->update($request->except(['avatar']));

        if ($request->file('avatar')) {
            $avatarName = str_replace('@', '_', $user->email).'_avatar.'.$request->file('avatar')->extension();
            if ($previous_avatar != $avatarName) {
                Storage::delete('avatars/'.$previous_avatar);
            }
            Storage::putFileAs('avatars', $request->file('avatar'), $avatarName);
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
        $user = User::find($id);
        $user->delete();
    }
}
