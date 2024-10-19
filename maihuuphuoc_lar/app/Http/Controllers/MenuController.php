<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MenuController extends Controller
{
    function list($position,$parentid=0, $limit=100)
    {
        $result=[
            'menu'=>[1,2,3,4,5],
            'message'=>'tai du lieu thanh cong',
            'status'=>true,
        ];
        return response()->json($result,200);
    }
}