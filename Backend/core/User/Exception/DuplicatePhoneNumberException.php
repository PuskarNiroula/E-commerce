<?php

namespace User\Exception;

use Exception;

class DuplicatePhoneNumberException extends Exception
{
    public function __construct($phone){
        $message = "User with Phone $phone already exists";
        parent::__construct($message);
    }

}
