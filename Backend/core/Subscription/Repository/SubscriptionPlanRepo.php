<?php

namespace Subscription\Repository;

use App\Models\StoreSubscriptionPlan;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Collection;
use Subscription\RepositoryInterface\SubscriptionPlanRepoInterface;

class SubscriptionPlanRepo implements SubscriptionPlanRepoInterface
{

    public function getMyCurrentPlan(int $shopId):StoreSubscriptionPlan
    {
      return StoreSubscriptionPlan::where('store_id',$shopId)
          ->where('status','active')
          ->findOrFail(1);

    }

    public function getAllPlans(): Collection
    {
        return StoreSubscriptionPlan::all();
    }

    public function getAllActivePlans():Collection
    {
        return StoreSubscriptionPlan::
        where('status','active')
        ->all();
    }

    public function activatePlan($planId):void
    {
       SubscriptionPlan::where('plan_id',$planId)->update(['status' => 'active']);
    }

    public function deactivatePlan($planId):void
    {
        SubscriptionPlan::find($planId)->update(['status' => 'inactive']);
    }


    //we will need a dto to identify the store and current plan to upgrade

    public function extendPlan($planId)
    {
        // TODO: Implement extendPlan() method.
    }
}
