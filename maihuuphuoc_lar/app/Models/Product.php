<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table='product';
    public function productImages()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    public function productStore()
    {
        return $this->hasOne(ProductStore::class, 'product_id');
    }
    public function productSale()
    {
        return $this->hasOne(ProductSale::class, 'product_id');
    }

}
