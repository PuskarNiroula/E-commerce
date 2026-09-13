<?php

namespace User\Dto;

class UserCreateDto
{

    public string $fullName;
    public string $password;
    public ?string $email;
    public ?string $phone;
    public string $role = "user";
}
