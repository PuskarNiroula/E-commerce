<?php

namespace Subscription\RepositoryInterface;

use Subscription\Dto\PaymentCreateDbModel;

interface PaymentRepoInterface
{
    public function initiatePayment(PaymentCreateDbModel $dto);

}
