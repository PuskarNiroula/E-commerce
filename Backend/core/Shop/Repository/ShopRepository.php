<?php

namespace Shop\Repository;

use App\Models\Shop;
use Shop\Dto\ShopCreateDto;
use Shop\RepositoryInterface\ShopRepositoryInterface;

class ShopRepository implements ShopRepositoryInterface
{


    /**
     * @param ShopCreateDto $shopCreateDto
     * @return void
     */
    public function createShop(ShopCreateDto $shopCreateDto): void
    {
        $shop = Shop::create([
            'name' => $shopCreateDto->name,
            'email' => $shopCreateDto->email,
            'phone' => $shopCreateDto->phone,
            'address' => $shopCreateDto->address,
            'description' => $shopCreateDto->description,
            'owner_id' => $shopCreateDto->owner_id,
        ]);

        if ($shopCreateDto->logo !== null) {
            $shop->update([
                'logo' => $shopCreateDto->logo,
            ]);
        }
    }

    /**
     * @param string $email
     * @return mixed
     */
    public function getShopByEmail(string $email):?Shop
    {
       return Shop::where('email', $email)->first();
    }

    /**
     * @param string $shopName
     * @return mixed
     */
    public function getShopByShopName(string $shopName):?Shop
    {
        return Shop::where('name', $shopName)->first();
    }
}
