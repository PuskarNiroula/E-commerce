<?php

namespace Subscription\RepositoryInterface;

interface SubscriptionPlanRepoInterface
{
    public function getMyCurrentPlan(int $shopId);
    public function getAllPlans();
    public function getAllActivePlans();
    public function activatePlan($planId);
    public function deactivatePlan($planId);
    public function extendPlan($planId);

}
