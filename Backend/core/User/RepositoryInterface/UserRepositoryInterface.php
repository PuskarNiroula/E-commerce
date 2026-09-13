<?php

namespace User\RepositoryInterface;

use User\Dto\UserCreateDto;

interface UserRepositoryInterface
{

    public function createUser(UserCreateDto $userCreateDto);
    public function getUserByEmail(string $email);
    public function getUserByPhone(string $phone);
}
