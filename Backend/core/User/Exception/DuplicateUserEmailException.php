<?php

namespace User\Exception;

use Exception;

class DuplicateUserEmailException extends Exception
{
    public function __construct($email){
        $message = "User with Email $email already exists";
        parent::__construct($message);
    }

}
