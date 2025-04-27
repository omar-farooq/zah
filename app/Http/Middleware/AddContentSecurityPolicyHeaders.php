<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Vite;

class AddContentSecurityPolicyHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        Vite::useCspNonce();

        if ($request->is('documents/*')) {
            return $next($request);
        }

        $response = $next($request);

        $appUrl = config('app.url');
        $appUrl = rtrim($appUrl, '/');

        $response->headers->set(
            'Content-Security-Policy',
            "script-src 'nonce-".Vite::cspNonce()."' 'wasm-unsafe-eval' {$appUrl};"
        );

        return $response;
    }
}
