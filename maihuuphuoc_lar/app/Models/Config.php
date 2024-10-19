<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    use HasFactory;

    protected $table = 'config'; // Tên bảng trong cơ sở dữ liệu
    protected $fillable = [
        'site_name',
        'email',
        'address',
        'hotline',
        'phone',
        'author',
        'status'
    ];

    public $timestamps = false; // Tắt timestamps nếu không sử dụng
}
