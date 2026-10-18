<?php

namespace App\ViewModels\Subscription;
class EsewaMetaData
{
    public string $paymentUrl;
    public string $transactionUuid;
    public float $amount;
    public float $taxAmount;
    public float $totalAmount;
    public string $productCode;
    public string $signature;
    public array $signedFieldNames;


}
