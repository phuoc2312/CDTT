<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    public $timestamps = false;
    protected $table = 'productimage';
    protected $fillable = ['product_id', 'thumbnail'];
}

