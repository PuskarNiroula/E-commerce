<?php

namespace Subscription\Dto;

use Ramsey\Uuid\Uuid;

class PaymentCreateDbModel extends PaymentCreateDto
{
    public int $storeId;
    public float $price;
    public string $transactionId;
    public string $status;


    public function __construct(){
        $this->transactionId = Uuid::uuid4()->toString();
    }


}
