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
        $token = $request->bearerToken();

        if (!$token) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        try {
            $user = JWTAuth::setToken($token)->authenticate();

            if (!$user) {
                abort(Response::HTTP_UNAUTHORIZED);
            }

            $request->setUserResolver(fn () => $user);

            return $next($request);
        } catch (Exception) {
            abort(Response::HTTP_UNAUTHORIZED);
        }
    }
}
