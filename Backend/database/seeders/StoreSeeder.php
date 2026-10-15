<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Shop::create([
            'name'=>"Puskar Store",
            "address"=>"Haldibari, Jhapa",
            "owner_id"=>1,
            "phone"=>"9825907032",
            "email"=>"puskardaju@gmail.com",
            "status"=>"active",
        ]);
    }
}
