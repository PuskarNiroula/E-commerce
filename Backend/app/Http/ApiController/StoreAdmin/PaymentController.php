<?php

namespace App\Http\ApiController\StoreAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentController extends Controller
{

    public function makePayment(Request $request){
        $idempotencyKey = $request->header('idempotency_key');
        $storeId = $request->storeId;
        $planId = $request->planId;
        $paymentMethod = $request->paymentMethod;
        $userId=$request->user()->id;


        return response()->json([
            "status"=>"success",
            "message"=>"Payment made successfully",
            "storeId"=>$storeId,
            "planId"=>$planId,
            "userId"=>$userId,
            "idempotencyKey"=>$idempotencyKey,
            "paymentMethod"=>$paymentMethod,
        ]);



    }
    public function showMyPaymentHistory(){

    }

}
