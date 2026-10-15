<?php

namespace Database\Seeders;

use App\Models\StoreSubscriptionPlan;

use Illuminate\Database\Seeder;

class StorePlanSeeder extends Seeder
{

    public function run(): void{
        StoreSubscriptionPlan::create([
            'store_id' => 1,
            'subscription_plan_id' => 1,
            'start_date' =>"2026-9-10",
            'end_date' =>"2026-10-10",
            'status' =>"active",
        ]);
    }
}
