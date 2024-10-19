<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    use HasFactory;
    protected $table="productsale";
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
