<?php

namespace Subscription\Service;

use App\ViewModels\Subscription\AvailableSubscriptionPlanResponseDto;
use App\ViewModels\Subscription\MyPlanResponseDto;
use App\ViewModels\Subscription\SubscriptionPlanDto;
use Subscription\RepositoryInterface\SubscriptionPlanRepoInterface;
use User\RepositoryInterface\UserRepositoryInterface;

readonly class SubscriptionService
{

    public function __construct(
       private SubscriptionPlanRepoInterface $planRepo,
       private UserRepositoryInterface $userRepo,
    ){}

    public function getMyPlan(int $userId):MyPlanResponseDto{
      $myPlan= $this->planRepo->getMyCurrentPlan($this->userRepo->getUserById($userId)->shop()->shop_id);
      $vm = new MyPlanResponseDto();
      $vm->name = $myPlan->name;
      $vm->status = $myPlan->status;
      $vm->expiryDate = $myPlan->expiry_date;
      return $vm;
    }
    public function getAvailablePlans():AvailableSubscriptionPlanResponseDto{

        $plans = $this->planRepo->getAllActivePlans();
        $vm = new AvailableSubscriptionPlanResponseDto();
        foreach ($plans as $plan){
            $data = new SubscriptionPlanDto();
            $data->id = $plan->subscription_plan_id;
            $data->name = $plan->name;
            $data->price = $plan->price;
            $vm ->subscriptionPlan[] = $data;
        }
        return $vm;
    }

}
