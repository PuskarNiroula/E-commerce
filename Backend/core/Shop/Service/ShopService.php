<?php

namespace Shop\Service;

use Shop\Dto\ShopCreateDto;
use Shop\Exceptions\DuplicateShopEmailException;
use Shop\Exceptions\DuplicateShopNameException;
use Shop\RepositoryInterface\ShopRepositoryInterface;

class ShopService
{
    public function __construct(
        private ShopRepositoryInterface $shopRepository
    ){}

    /**
     * @throws DuplicateShopNameException
     * @throws DuplicateShopEmailException
     */
    public function createShop(ShopCreateDto $shopCreateDto):void{
        $this->verifyNewShopName($shopCreateDto->name);
        $this->verifyNewShopEmail($shopCreateDto->email);
        $this->shopRepository->createShop($shopCreateDto);
    }

    /**
     * @throws DuplicateShopNameException
     */
    private function verifyNewShopName($shopName):void{
        $shop = $this->shopRepository->getShopByShopName($shopName);
        if($shop)
            throw new DuplicateShopNameException();
    }

    /**
     * @throws DuplicateShopEmailException
     */
    private function verifyNewShopEmail($shopEmail):void{
        $shop = $this->shopRepository->getShopByEmail($shopEmail);
        if($shop)
            throw new DuplicateShopEmailException();
    }

}
