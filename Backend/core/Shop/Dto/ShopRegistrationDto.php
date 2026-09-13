<?php

namespace Shop\Dto;

use User\Dto\UserCreateDto;

class ShopRegistrationDto
{

    public ShopCreateDto $shop;
    public UserCreateDto $user;
}
