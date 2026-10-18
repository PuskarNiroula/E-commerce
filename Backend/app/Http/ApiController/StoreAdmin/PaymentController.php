<?php

namespace App\Http\ApiController\StoreAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Subscription\Dto\PaymentCreateDto;
use Subscription\Service\PaymentService;

class PaymentController extends Controller
{


    public function __construct(
        private readonly PaymentService $paymentService
    ){

    }

    public function makePayment(PaymentRequest $request):JsonResponse{
        $paymentCreateDto = new PaymentCreateDto();
        $paymentCreateDto->paymentMethod = $request->payment_method;
        $paymentCreateDto->planId = $request->plan_id;
        $paymentCreateDto->userId = 1;
        $paymentCreateDto->idempotencyKey=$request->header('Idempotency-Key');

        try{
            $vm=$this->paymentService->makePayment($paymentCreateDto);

            return response()->json([
                "status"=>"success",
                "data"=>$vm
            ]);
        }catch (Exception $e){
            return new JsonResponse([
                'success' => false,
                'message' => $e->getMessage()

            ],400);
        }
    }
    public function showMyPaymentHistory(){

    }

    public function getMyEsewaMetaDataForPayment(int $paymentId){
        try{

        }catch (Exception $e){
            return new JsonResponse([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }

    }

}
