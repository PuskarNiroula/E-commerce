<?php

namespace Shop\Exceptions;

use Exception;

class DuplicateShopNameException extends Exception
{
    public function __construct($message = "Shop name already exists"){
        parent::__construct($message);
    }

}
