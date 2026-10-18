<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{

    protected $table = 'subscription_plans';
    protected $primaryKey = 'subscription_plan_id';
    protected $guarded=[];

    public function StorePlans():HasMany
    {
        return $this->HasMany(StoreSubscriptionPlan::class,'store_subscription_plan_id','store_subscription_plan_id');
    }

    public function Payment():HasMany{
        return $this->HasMany(Payment::class,'payment_id','payment_id');
    }


}
