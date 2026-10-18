<?php

namespace Subscription\Dto;

class PaymentCreateDto
{
    public ?string $idempotencyKey=null;
    public string $paymentMethod;
    public int $planId;
    public int $userId=1;


}
