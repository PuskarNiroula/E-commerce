<?php

namespace App\ViewModels\Subscription;

use Subscription\Enum\PaymentMethodEnum;

class EsewaPaymentInitiationViewModel extends PaymentViewModel
{
    public function __construct(){
        $this->paymentMethod = PaymentMethodEnum::Esewa->value;

    }

}
