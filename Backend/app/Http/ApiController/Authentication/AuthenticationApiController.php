<?php

namespace App\Http\ApiController\Authentication;
use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessRegisterRequest;
use Exception;
use Shop\Dto\ShopCreateDto;
use Shop\Dto\ShopRegistrationDto;
use User\Dto\UserCreateDto;

class AuthenticationApiController extends Controller
{

    public function registerShop(BusinessRegisterRequest $request){
       try{
          $shopCreateDto = new ShopCreateDto();
          $shopCreateDto->name = $request->storeName;
          $shopCreateDto->address = $request->address;
          $shopCreateDto->phone = $request->storePhone;
          $shopCreateDto->email = $request->storeEmail;
          $shopCreateDto->description = $request->description;
          if($request->hasFile('logo')){
              $shopCreateDto->logo = $request->file('logo');
          }
          $userCreateDto = new UserCreateDto();
          $userCreateDto->fullName = $request->name;
          $userCreateDto->email = $request->email;
          $userCreateDto->phone = $request->phone;
          $userCreateDto->password = $request->password;

          $shopRegistrationDto = new ShopRegistrationDto();
          $shopRegistrationDto->shop = $shopCreateDto;
          $shopRegistrationDto->user = $userCreateDto;





       }catch (Exception $e){
           return response()->json([
               'error' => $e->getMessage()], 401);
       }
    }

}
