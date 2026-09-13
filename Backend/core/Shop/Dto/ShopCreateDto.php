<?php

namespace Shop\Dto;

use Illuminate\Http\UploadedFile;

class ShopCreateDto
{
    public string $name;
    public string $address;
    public ?int $owner_id=null;
    public string $phone;
    public string $email;
    public ?string $logo = null;
    public ?string $description = null;
    public string $status = 'active';
    public ?string $valid_till=null;

    public ?UploadedFile $logo_file = null;
}
