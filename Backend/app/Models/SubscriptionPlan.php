<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{

    protected $table = 'subscription_plans';
    protected $guarded=[];

    public function StorePlans():HasMany
    {
        return $this->HasMany(StoreSubscriptionPlan::class,'subscription_plan_id','subscription_plan_id');
    }


}
