<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements JWTSubject
{

    use HasFactory;

    protected $fillable = ['name', 'email', 'password', 'phone', 'role'];

    /**
     * @return mixed
     */
    public function getJWTIdentifier():array
    {
        return $this->getKey();
    }

    /**
     * @return array
     */
    public function getJWTCustomClaims():array
    {
        return ([
            'user_id'=>$this->id,
            "email"=>$this->email,
        ]);
    }
}
