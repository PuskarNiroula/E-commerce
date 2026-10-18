<?php

namespace Subscription\Service;

use App\Models\Payment;
use App\Models\Shop;
use App\Models\SubscriptionPlan;
use App\ViewModels\Subscription\EsewaMetaData;
use App\ViewModels\Subscription\EsewaPaymentInitiationViewModel;
use App\ViewModels\Subscription\PaymentViewModel;
use Exception;
use Illuminate\Support\Facades\DB;
use Shop\RepositoryInterface\ShopRepositoryInterface;
use Subscription\Dto\PaymentCreateDbModel;
use Subscription\Dto\PaymentCreateDto;
use Subscription\Enum\PaymentMethodEnum;
use Subscription\Enum\PaymentStatusEnum;
use Subscription\RepositoryInterface\PaymentRepoInterface;
use Subscription\RepositoryInterface\SubscriptionPlanRepoInterface;

readonly class PaymentService
{
    public function __construct(
        private PaymentRepoInterface $paymentRepo,
        private ShopRepositoryInterface $shopRepo,
        private SubscriptionPlanRepoInterface $subscriptionPlanRepo,
    ){

    }

    /**
     * @throws Exception
     * @throws \Throwable
     */
    public function makePayment(PaymentCreateDto $dto): PaymentViewModel
    {
        if (!in_array($dto->paymentMethod, PaymentMethodEnum::getAsArray(), true)) {
            throw new \InvalidArgumentException('Unsupported payment method');
        }

        $shop = $this->getStoreInfo($dto->userId);

        $dbModel = new PaymentCreateDbModel();
        $dbModel->planId = $dto->planId;
        $dbModel->paymentMethod = $dto->paymentMethod;
        $dbModel->price = $this->getPlanCurrentPrice($dto->planId);
        $dbModel->status = PaymentStatusEnum::PENDING->value;
        $dbModel->storeId = $shop->store_id;
        $dbModel->idempotencyKey = $dto->idempotencyKey;

        DB::beginTransaction();

        try {
            $paymentModel = $this->paymentRepo->initiatePayment($dbModel);

            if ($paymentModel->payment_method === PaymentMethodEnum::Esewa->value) {
                $paymentModel->load('subscriptionPlan');

                $vm= $this->generateEsewaPaymentViewModel($paymentModel);

            } else {
                $vm = new PaymentViewModel();
                $vm->paymentMethod = 'not Made Yet';
            }

            DB::commit();

            return $vm;

        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    public function generateEsewaMetaData(int $paymentId, int $userId){
        $payment=$this->verifyUser($paymentId,$userId);
        $metaData = new EsewaMetaData();

        $metaData->amount = $payment->price;
        $metaData->taxAmount = 0;
        $metaData->totalAmount=$metaData->amount;
        $metaData->transactionUuid = $payment->transaction_id;
        $metaData->productCode = config('services.esewa.product_code');
        $metaData->signedFieldNames=["total_amount,transaction_uuid,product_code"];
        $metaData->signature =$this->generateEsewaSignature($metaData->totalAmount,$metaData->transactionUuid,$metaData->productCode);





    }

    private function getStoreInfo(int $userId):Shop{
        return $this->shopRepo->getShopByOwnerId($userId);
    }
    private function getPlanCurrentPrice(int $planId): int{
        return $this->subscriptionPlanRepo->getPlanPriceById($planId);
    }

    private function generateEsewaPaymentViewModel(Payment $payment): EsewaPaymentInitiationViewModel{
        $vm = new EsewaPaymentInitiationViewModel();
        $vm->amount = $payment->price;
        $vm->transactionId = $payment->transaction_id;
        $vm->planName = $payment->subscriptionPlan->name;

        return $vm;
    }


    /**
     * @throws Exception
     *
     */
    //need custom exception and repo functions
    private function verifyUser(int $paymentId, int $userId):Payment{
        $payment=Payment::find($paymentId);
        if($payment->owner_id!==$userId)
            throw new Exception("Forbidden");
        if($payment->status!==PaymentStatusEnum::PENDING->value)
            throw new Exception("Payment Expired");
        return $payment;

    }

    private function generateEsewaSignature(
        string $totalAmount,
        string $transactionUuid,
        string $productCode
    ): string {
        $message = "total_amount={$totalAmount},"
            . "transaction_uuid={$transactionUuid},"
            . "product_code={$productCode}";

        $secretKey = config('services.esewa.secret_key');

        return base64_encode(
            hash_hmac('sha256', $message, $secretKey, true)
        );
    }


}
