<?php

namespace Subscription\Enum;

enum PaymentStatusEnum:string
{
    case PENDING = 'pending';
    case VERIFIED = 'verified';
    case REJECTED = 'rejected';
    case CANCELLED = 'cancelled';
    case FAILED = 'failed';
    case COMPLETED = 'completed';



    public static function getAsArray(): array{
        return array_column(self::cases(), 'value');
    }


}
