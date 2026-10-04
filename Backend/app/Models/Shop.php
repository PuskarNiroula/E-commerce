<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
   protected $primaryKey = 'store_id';
    protected $table = 'stores';
    protected $fillable = ['name', 'address', 'owner_id', 'phone', 'email','logo', 'description', 'status', 'valid_till'];

    public function owner():HasMany{
        return $this->HasMany(User::class,'owner_id','id');
    }
}
