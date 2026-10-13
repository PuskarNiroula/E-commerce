<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "name"=>"Puskar Niroula",
            "phone"=>"9825907032",
            'role'=>"admin",
            "email"=>"puskarniroula8@gmail.com",
            "password"=> bcrypt("Newlife@2057"),
        ]);
    }
}
