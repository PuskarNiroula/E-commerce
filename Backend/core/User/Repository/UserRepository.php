<?php

namespace User\Repository;

use App\Models\User;
use User\Dto\UserCreateDto;
use User\RepositoryInterface\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{

    /**
     * @param UserCreateDto $userCreateDto
     * @return User
     */
    public function createUser(UserCreateDto $userCreateDto):User
    {
       return User::create([
            'name'=>$userCreateDto->fullName,
            'email'=>$userCreateDto->email,
            'phone'=>$userCreateDto->phone,
            'password'=>$userCreateDto->password,
            'role'=>$userCreateDto->role
        ]);
    }

    /**
     * @param string $email
     * @return User|null
     */
    public function getUserByEmail(string $email):?User{
        return User::where('email', $email)->first();
    }

    /**
     * @param string $phone
     * @return User|null
     */
    public function getUserByPhone(string $phone):?User
    {
        return User::where('phone', $phone)->first();
    }

}
