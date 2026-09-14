<?php
namespace Authentication\Service;

use Exception;
use Illuminate\Support\Facades\DB;
use Shop\Dto\ShopRegistrationDto;
use Shop\Exceptions\DuplicateShopNameException;
use Shop\Service\ShopService;
use Throwable;
use User\Enum\UserRoleEnum;
use User\Exception\DuplicatePhoneNumberException;
use User\Exception\DuplicateUserEmailException;
use User\Service\UserService;

readonly class AuthenticationService
{
    public function __construct(
        private UserService $userService,
        private ShopService $shopService
    ){}


    /**
     * @throws DuplicateUserEmailException
     * @throws Throwable
     * @throws DuplicatePhoneNumberException
     * @throws DuplicateShopNameException
     */
    public function registerBusiness(ShopRegistrationDto $dto):void{
        $userDto = $dto->user;
        $userDto->role = UserRoleEnum::ADMIN->value;
        $shopDto = $dto->shop;
        DB::beginTransaction();
        try{
           $user= $this->userService->createUser($userDto);
           $shopDto->owner_id = $user->id;
           $this->shopService->createShop($shopDto);
           DB::commit();
        }catch (Exception $e){
            DB::rollBack();
            throw $e;
        }

    }
    public function login(string $email,string $password){

        try{
            $user = $this->userService->login($email, $password);

        }catch (Exception $e){
            throw $e;
        }





    }


}
