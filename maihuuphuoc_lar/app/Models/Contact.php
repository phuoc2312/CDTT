<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;
    protected $table = 'contact';
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'reply_id',
        'created_by',
        'updated_by',
        'status'
    ];

    protected $dates = ['deleted_at'];
}
