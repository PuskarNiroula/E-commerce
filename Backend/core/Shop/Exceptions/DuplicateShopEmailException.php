<?php

namespace Shop\Exceptions;

use Exception;

class DuplicateShopEmailException extends Exception
{
    public function __construct($message = "Shop Email already exists"){
        parent::__construct($message);
    }

}
