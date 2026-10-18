<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{


    protected $table = 'payments';
    protected $primaryKey = 'payment_id';
    protected $guarded = [];


    public function subscriptionPlan(): belongsTo{
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id', 'subscription_plan_id');
    }
}
