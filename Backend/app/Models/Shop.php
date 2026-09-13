<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
   protected $primaryKey = 'store_id';
    protected $table = 'stores';
    protected $fillable = ['name', 'address', 'owner_id', 'phone', 'email','logo', 'description', 'status', 'valid_till'];
}
