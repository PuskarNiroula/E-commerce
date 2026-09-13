<?php

namespace Shop\RepositoryInterface;

use Shop\Dto\ShopCreateDto;

interface ShopRepositoryInterface
{
    public function createShop(ShopCreateDto $shopCreateDto):void;
    public function getShopByEmail(string $email);
    public function getShopByShopName(string $shopName);

}
