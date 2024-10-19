<?php

namespace App\Http\Controllers;
use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::where('status','!=',2)
            ->orderBy('id', 'DESC')
            ->select("id","title","slug","content","thumbnail","description","status")
            ->get();
            if ($posts->isEmpty()) {
                $result = [
                    'status' => false,
                    'message' => 'Không tìm thấy dữ liệu',
                    'posts' => null
                ];
            }
            else {
                $result =[
                    'status'=>true,
                    'message'=>'Tải dữ liệu thành công',
                    'posts'=>$posts
                ];
               }
        return response()->json($result);
    }

    public function trash()
    {
        $posts = Post::where('status','=',2)
        ->orderBy('id', 'DESC')
        ->select("id","title","slug","content","thumbnail","description","status")
        ->get();
        if ($posts->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'posts' => null
            ];
        }
       else {
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'posts'=>$posts
        ];
       }
        return response()->json($result);
    }

    public function show($id)
    {
        $post = post::find($id);
        if($post==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'post'=>$post
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'post'=>$post
            ];
        }
        return response()->json($result);
    }


    public function store(StorePostRequest $request)
    {
        $post = new Post();
        $post->title = $request->title;
        $post->slug =  $request->slug;
        $post->content =  $request->content;
        $post->topic_id =  $request->topic_id;
        $list_exten =['jpg','png','webp','gif'];
        if($request->thumbnail)
        {
           $exten=$request->thumbnail->extension();
            if(in_array($exten, $list_exten))
            {
                $thumbnailName = date('YmdHis').".".$exten;
                $request->thumbnail->move(public_path('images/post'), $thumbnailName);
                $post->thumbnail =  $thumbnailName;
            }
        }
        $post->description =  $request->description;
        $post->type =  $request->type ?? 'post';
        $post->status =  1;
        $post->created_by =  1;
        $post->created_at = date('Y-m-d H:i:s');
        if($post->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'post'=>$post
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Thêm thất bại',
                'post'=>null
            ];
        }

        return response()->json($result);
    }


    public function update(UpdatepostRequest $request, $id)
    {
        $post = post::find($id);
        if($post==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'post'=>$post
            ];
        }
        else
        {
            $post->title = $request->title;
            $post->slug =  $request->slug;
            $post->content =  $request->content;
            $post->topic_id =  $request->topic_id;
            $list_exten =['jpg','png','webp','gif'];
            if($request->thumbnail) {
                if ($post->thumbnail && file_exists(public_path('images/post/' . $post->thumbnail))) {
                    unlink(public_path('images/post/' . $post->thumbnail));
                }

                $exten = $request->thumbnail->extension();
                if (in_array($exten, $list_exten)) {
                    $thumbnailName = date('YmdHis') . "." . $exten;
                    $request->thumbnail->move(public_path('images/post'), $thumbnailName);
                    $post->thumbnail = $thumbnailName;
                }
            }
            $post->description =  $request->description;
            $post->type =  $request->type;
            $post->status =  1;
            $post->updated_by =  1;
            $post->updated_at = date('Y-m-d H:i:s');
            $post->save();
            $result =[
                'status'=>true,
                'message'=>'Sửa thành công',
                'post'=>$post
            ];
        }
        return response()->json($result);
    }


    public function status($id)
    {
        $post = post::where('status','=',$id)
        ->orderBy('id', 'DESC')
        ->select("id","title","slug","content","thumbnail","description","status")
        ->get();
        if ($post->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'post' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'post' => $post
            ];
        }
        return response()->json($result);
    }


    public function delete($id)
    {
        $post = post::find($id);
        if($post==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'post'=>$post
            ];
        } elseif($post->status!=1) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'post'=>null
            ];
        }
        else
        {
            $post->status = 2;
            $post->updated_by =  1;
            $post->updated_at =  date('Y-m-d H:i:s');
            $post->save();
            $result =[
                'status'=>true,
                'message'=>'Dữ liệu đưa vào thùng rác thành công',
                'post'=>$post
            ];
        }
        return response()->json($result);
    }


    public function restore($id)
    {
        $post = post::find($id);
        if($post==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'post'=>$post
            ];
        } elseif($post->status!=2) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'post'=>null
            ];
        }
        else
        {
            $post->status = 1;
            $post->updated_by =  1;
            $post->updated_at =  date('Y-m-d H:i:s');
            $post->save();
            $result =[
                'status'=>true,
                'message'=>'Khôi phục dữ liệu thành công',
                'post'=>$post
            ];
        }
        return response()->json($result);
    }



    public function destroy($id)
{
    // Tìm bài viết theo ID
    $post = Post::find($id);

    // Kiểm tra xem bài viết có tồn tại hay không
    if ($post === null) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'post' => null
        ]);
    }

    // Lưu lại thông tin bài viết để có thể sử dụng sau khi xóa
    $postData = $post;

    // Xóa bài viết khỏi cơ sở dữ liệu
    $post->delete();

    return response()->json([
        'status' => true,
        'message' => 'Xóa dữ liệu thành công',
        'post' => $postData // Trả lại dữ liệu bài viết đã bị xóa nếu cần
    ]);
}
public function updateStatus(Request $request, $id)
{
    // Tìm bài viết theo ID
    $post = Post::find($id);
    if (!$post) {
        return response()->json(['status' => false, 'message' => 'Bài viết không tồn tại']);
    }

    // Chuyển đổi trạng thái: bật (1) hoặc tắt (0)
    $post->status = $post->status === 1 ? 0 : 1; // Chuyển đổi trạng thái
    $post->updated_at = now(); // Cập nhật thời gian sửa đổi
    $post->save(); // Lưu thay đổi

    return response()->json(['status' => true, 'message' => 'Cập nhật trạng thái thành công']);
}
}
