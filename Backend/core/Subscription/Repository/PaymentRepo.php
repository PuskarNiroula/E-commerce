<?php

namespace Subscription\Repository;

use App\Models\Payment;
use Subscription\Dto\PaymentCreateDbModel;
use Subscription\RepositoryInterface\PaymentRepoInterface;

class PaymentRepo implements PaymentRepoInterface
{

    public function initiatePayment(PaymentCreateDbModel $dto): Payment
    {
        return Payment::create([
            'idempotency_key' => $dto->idempotencyKey,
            'payment_method' => $dto->paymentMethod,
            'subscription_plan_id' => $dto->planId,
            'price' => $dto->price,
            'store_id' => $dto->storeId,
            'payment_status' => $dto->status,
            'transaction_id' => $dto->transactionId,
            'retry_count' => 0,
            "user_id" => $dto->userId,
        ]);

    }

}
