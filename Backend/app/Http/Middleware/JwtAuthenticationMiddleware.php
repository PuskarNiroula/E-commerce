<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthenticationMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('bearer_token');

        if (!$token) {
            return response()->json(['error' => ' first Lodey ka lasun'], 401);
        }

        try {
            $user = JWTAuth::setToken($token)->authenticate();

            if (!$user) {
                return response()->json(['error' => ' second Lodey ka lasun'], 401);
            }

            $request->setUserResolver(fn () => $user);

            return $next($request);
        } catch (Exception) {
            return response()->json(['error' => ' final Lodey ka lasun'], 401);
        }
    }
}
