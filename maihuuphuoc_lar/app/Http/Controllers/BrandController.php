<?php

namespace App\Http\Controllers;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;

use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::where('status','!=',2
        )
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","thumbnail","description","status")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'brands'=>$brands
        ];
        return response()->json($result);
    }

    public function trash()
    {
        $brands = Brand::where('status','=',2)
            ->orderBy('sort_order','ASC')
            ->select("id","name","slug","thumbnail","description","status")
            ->get();
        $result =[
            'status'=>true,
            'message'=>'Tải dữ liệu thành công',
            'brands'=>$brands
        ];
        return response()->json($result);
    }

    public function show($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        }
        else
        {
            $result =[
                'status'=>true,
                'message'=>'Tải dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }


    public function store(StoreBrandRequest $request)
    {
        $brand = new Brand();
        $brand->name =  $request->name;
        $brand->slug =  $request->slug;
        $brand->description =  $request->description;
        $list_exten =['jpg','png','webp','gif'];
        if($request->thumbnail)
        {
           $exten=$request->thumbnail->extension();
            if(in_array($exten, $list_exten))
            {
                $thumbnailName = date('YmdHis').".".$exten;
                $request->thumbnail->move(public_path('images/brand'), $thumbnailName);
                $brand->thumbnail =  $thumbnailName;
            }
        }
        $brand->sort_order =  $request->sort_order;
        $brand->status =  1;
        $brand->created_by =  1;
        $brand->created_at =  date('Y-m-d H:i:s');
        if($brand->save())
        {
            $result =[
                'status'=>true,
                'message'=>'Thêm thành công',
                'brand'=>$brand
            ];
        }
        else
        {
            $result =[
                'status'=>false,
                'message'=>'Thêm thất bại',
                'brand'=>null
            ];
        }

        return response()->json($result);
    }


    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(['status' => false, 'message' => 'Thương hiệu không tồn tại']);
        }

        // Xác thực dữ liệu vào
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048', // Xác thực cho ảnh
        ]);

        // Cập nhật các trường thông thường
        $brand->name = $validatedData['name'];
        $brand->slug = $validatedData['slug'];
        $brand->description = $validatedData['description'];
        $brand->status = $validatedData['status'];

        // Kiểm tra và xử lý upload ảnh mới
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            $extension = $file->getClientOriginalExtension();

            if (in_array($extension, $allowedExtensions)) {
                // Xóa hình cũ nếu cần
                if ($brand->thumbnail) {
                    \File::delete(public_path('images/brand/' . $brand->thumbnail));
                }
                $fileName = time() . '.' . $extension;
                $file->move(public_path('images/brand'), $fileName);
                $brand->thumbnail = $fileName;
            } else {
                return response()->json(['status' => false, 'message' => 'Định dạng file không hợp lệ']);
            }
        }

        // Lưu thông tin vào cơ sở dữ liệu
        $brand->save();

        return response()->json(['status' => true, 'message' => 'Cập nhật thành công', 'brand' => $brand]);
    }


    public function status($id)
    {
        $brand = Brand::where('status','=',$id)
        ->orderBy('sort_order','ASC')
        ->select("id","name","slug","thumbnail","description")
        ->get();
        if ($brand->isEmpty()) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'brand' => null
            ];
        } else {
            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'brand' => $brand
            ];
        }

        return response()->json($result);
    }


    public function delete($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        } elseif($brand->status!=1) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>null
            ];
        }
        else
        {
            $brand->status = 2;
            $brand->updated_by =  1;
            $brand->updated_at =  date('Y-m-d H:i:s');
            $brand->save();
            $result =[
                'status'=>true,
                'message'=>'Dữ liệu đưa vào thùng rác thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }


    public function restore($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        } elseif($brand->status!=2) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>null
            ];
        }
        else
        {
            $brand->status = 1;
            $brand->updated_by =  1;
            $brand->updated_at =  date('Y-m-d H:i:s');
            $brand->save();
            $result =[
                'status'=>true,
                'message'=>'Khôi phục dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }



    public function destroy($id)
    {
        $brand = Brand::find($id);
        if($brand==null)
        {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>$brand
            ];
        } elseif($brand->status!=1) {
            $result =[
                'status'=>false,
                'message'=>'Không tìm thấy dữ liệu',
                'brand'=>null
            ];
        }
        else
        {
            $brand->status = 2;
            $brand->updated_by =  1;
            $brand->updated_at =  date('Y-m-d H:i:s');
            $brand->save();
            $result =[
                'status'=>true,
                'message'=>'Xóa dữ liệu thành công',
                'brand'=>$brand
            ];
        }
        return response()->json($result);
    }
    public function updateStatus(Request $request, $id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(['status' => false, 'message' => 'Thương hiệu không tồn tại']);
        }

        // Chuyển đổi trạng thái mà không cần gửi lại thông tin trạng thái
        $brand->status = $brand->status === 1 ? 0 : 1; // Nếu đang bật (1), chuyển thành tắt (2) và ngược lại
        $brand->save();

        return response()->json(['status' => true]); // Chỉ trả về trạng thái thành công
    }


    public function forceDelete($id)
{
    $brand = Brand::find($id);
    if ($brand == null || $brand->status != 2) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu hoặc Brand không ở trạng thái thùng rác',
            'brand' => null
        ]);
    }

    // Xóa hình ảnh khỏi hệ thống lưu trữ nếu có
    if ($brand->image && Storage::exists('public/images/Brand/' . $brand->image)) {
        Storage::delete('public/images/Brand/' . $brand->image);
    }

    // Xóa vĩnh viễn brand khỏi cơ sở dữ liệu
    $brand->forceDelete();

    return response()->json([
        'status' => true,
        'message' => 'Brand đã được xóa vĩnh viễn',
        'brand' => null
    ]);
}


}
