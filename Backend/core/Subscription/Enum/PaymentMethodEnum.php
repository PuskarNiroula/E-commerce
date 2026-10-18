<?php

namespace Subscription\Enum;

enum PaymentMethodEnum: string
{
    case Esewa = 'esewa';
    case Stripe = 'stripe';
    case Khalti = 'khalti';

    public static function getAsArray(): array
    {
        return array_column(self::cases(), 'value');
    }
}
