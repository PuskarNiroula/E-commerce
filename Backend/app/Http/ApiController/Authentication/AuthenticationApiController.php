<?php

namespace App\Http\ApiController\Authentication;

use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessRegisterRequest;
use App\Http\Requests\LoginRequest;
use Authentication\Dto\LoginDto;
use Authentication\Service\AuthenticationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Shop\Dto\ShopCreateDto;
use Shop\Dto\ShopRegistrationDto;
use Throwable;
use User\Dto\UserCreateDto;

 class AuthenticationApiController extends Controller
{

    public function __construct(
        private  readonly AuthenticationService $authenticationService
    ){}

    public function registerShop(BusinessRegisterRequest $request):JsonResponse{
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
          $userCreateDto->fullName = $request->fullName;
          $userCreateDto->email = $request->email;
          $userCreateDto->phone = $request->phone;
          $userCreateDto->password = $request->password;

          $shopRegistrationDto = new ShopRegistrationDto();
          $shopRegistrationDto->shop = $shopCreateDto;
          $shopRegistrationDto->user = $userCreateDto;

          $this->authenticationService->registerBusiness($shopRegistrationDto);
          return response()->json([
              'message' => 'Shop registered successfully'
          ]);

       } catch (Exception $e){
           return response()->json([
               'error' => $e->getMessage()], 401);
       } catch (Throwable $e) {
           return response()->json([
               'error' => $e->getMessage(),
           ],401);
       }
    }

    public function login(LoginRequest $request):JsonResponse{

        try{
            $loginDto = new LoginDto();
            $loginDto->email = $request->email;
            $loginDto->password = $request->password;

           $response=$this->authenticationService->login($loginDto);
            $cookie = cookie(
                'bearer_token',
                $response->token,
                60*24*7,
                '/',
                null,
                false,
                true,
                false,
                'lax'
            );

           $response= response()->json([
               'data' => $response,
               'message' => ' login successfully'
           ]);
           $response->headers->setCookie($cookie);
           return $response;

        }catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage(),
                'message'=>"invalid credentials"
            ],400);

        }

    }

}
