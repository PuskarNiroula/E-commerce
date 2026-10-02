<?php

namespace App\ViewModels;

use App\Models\User;

class LoginResponseViewModel
{
   public User $user;
   public string $token;

}
