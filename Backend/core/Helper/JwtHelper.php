<?php

namespace Helper;

use App\Models\User;
use Exception;
use PHPOpenSourceSaver\JWTAuth\JWTAuth;

class JwtHelper
{
    public function generateToken(User $user): string
    {
        return JWTAuth::claims([
            'user_id' => $user->id,
            'role' => $user->role,
        ])->fromUser($user);
    }

    public function getUserId(string $token): int
    {
        $payload = JWTAuth::setToken($token)->getPayload();

        return (int) $payload->get('user_id');
    }

    public function getRole(string $token): string
    {
        $payload = JWTAuth::setToken($token)->getPayload();

        return (string) $payload->get('role');
    }

    public function getUserData(string $token): array
    {
        $payload = JWTAuth::setToken($token)->getPayload();

        return [
            'user_id' => (int) $payload->get('user_id'),
            'role' => $payload->get('role')
        ];
    }

    public function validateToken(string $token): bool
    {
        try {
            JWTAuth::setToken($token)->getPayload();

            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
