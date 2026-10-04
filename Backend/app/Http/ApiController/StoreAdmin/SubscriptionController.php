<?php

namespace App\Http\ApiController\StoreAdmin;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Subscription\Service\SubscriptionService;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ){

    }
    public function showMyCurrentPlan(Request $request):JsonResponse{
        try{
            $vm =$this->subscriptionService->getMyPlan($request->user()->id);
            return response()->json($vm);
        }catch (Exception $e){
            return response()->json(
                [
                    'error' => $e->getMessage()
                ],500
            );
        }

    }

    public function showAvailableSubscriptions():JsonResponse{
        try{
            $plans = $this->subscriptionService->getAvailablePlans();
            return response()->json($plans);

        }catch (Exception $e){
            return response()->json($e->getMessage(),500);
        }
    }

}
