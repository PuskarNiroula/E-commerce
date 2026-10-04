<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StoreSubscriptionPlan extends Model
{
    protected $table = 'store_subscription_plans';
    protected $guarded = [];

    public function SubscriptionPlan():HasOne{
        return $this->hasOne(SubscriptionPlan::class,'subscription_plan_id','subscription_plan_id');
    }

}
