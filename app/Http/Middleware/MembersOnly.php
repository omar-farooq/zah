<?php

namespace App\Http\Middleware;

use App\Models\User;
use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MembersOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = new User;
        $currentUserID = Auth::id();
        $membership = $user->currentMember()->where('id', $currentUserID)->get()->count();
        if ($membership == 1) {
            return $next($request);
        } else {
            abort(403);
        }
    }
}
