<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductStore;
use App\Models\ProductSale;
use App\Models\Order;
use App\Models\OrderDetail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class ProductController extends Controller
{
public function index()
{
         // Sử dụng join để kết hợp dữ liệu từ bảng product, productstore và productimage
         $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
         ->join('productimage', 'product.id', '=', 'productimage.product_id') // kết nối với bảng productimage có id bằng product_id
         ->join('productsale', 'product.id', '=', 'productsale.product_id')
         ->join('brand', 'product.brand_id', '=', 'brand.id')
         ->join('category', 'product.category_id', '=', 'category.id')


        //  ->orderBy('product.created_at', 'DESC')
         ->select(
             'product.id',
             'product.name',
             'product.slug',
             'product.category_id',
             'product.brand_id',
             'brand.name as brand_name',
             'category.name as category_name',
             'product.content',
             'product.pricebuy',
             'product.description',
             'product.created_at',
             'product.created_by',
             'product.updated_at',
             'product.updated_by',
             'product.status',
             'productimage.thumbnail',
             'productstore.qty',
             'productstore.priceroot',
             'productsale.pricesale',

         )
         ->where('product.status', '!=', 0 )
         ->where('productstore.status', '!=', 2 )
         ->get();
         foreach ($products as $product) {
            $product->thumbnail = url('images/product/' . $product->thumbnail); // Thêm URL đầy đủ cho thumbnail
        }


     return response()->json([
         'status' => true,
         'message' => 'Tải dữ liệu sản phẩm thành công',
         'products' => $products
     ]);
}


public function store(Request $request)
    {
        // Thêm sản phẩm vào bảng 'product'
        $product = new Product();
        $product->name = $request->name;
        $product->slug = $request->slug;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->content = $request->content;
        $product->description = $request->description;
        $product->pricebuy = $request->pricebuy;
        $product->created_by = 1; // Đặt giá trị mặc định hoặc từ auth user
        $product->status = $request->status ?? 1;
        $product->save();

        // Thêm dữ liệu vào bảng 'db_productstore'
        $productStore = new ProductStore();
        $productStore->product_id = $product->id;
        $productStore->priceroot = $request->priceroot;
        $productStore->qty = $request->qty;
        $productStore->dateimport = now(); // Sử dụng thời gian hiện tại
        $productStore->created_by = 1; // Đặt giá trị mặc định hoặc từ auth user
        $productStore->status = $request->status ?? 1;
        $productStore->save();

        $productSale = new ProductSale();
        $productSale->product_id = $product->id;
        $productSale->pricesale = 0;

        $productSale->created_by = 1; // Đặt giá trị mặc định hoặc từ auth user
        $productSale->status = $request->status ?? 1;
        $productSale->save();

        // Xử lý ảnh nếu có
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = date('YmdHis') . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $imageName);
            $productImage = new ProductImage();
            $productImage->product_id = $product->id;
            $productImage->thumbnail = $imageName;
            $productImage->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Thêm sản phẩm và dữ liệu kho thành công',
            'product' => $product,
            'product_store' => $productStore,
            'product_image' => $productImage ?? null
        ]);
    }


public function indexFrontend()
    {
        // Sử dụng join để kết hợp dữ liệu từ bảng product, productstore và productimage
        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productimage', 'product.id', '=', 'productimage.product_id') // kết nối với bảng productimage có id bằng product_id
            ->orderBy('product.created_at', 'DESC')
            ->select(
                'product.id',
                'product.name',
                'product.category_id',
                'product.pricebuy',
                'product.description',
                'productimage.thumbnail', // Lấy thumbnail từ bảng productimage
                'productstore.qty'
            )
            ->where('product.status', '!=', 0)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm thành công',
            'products' => $products
        ]);
    }
    public function update(Request $request, $id)
    {
        // Tìm sản phẩm theo ID
        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm',
                'product' => null
            ]);
        }

        // Cập nhật thông tin sản phẩm
        $product->name = $request->name ?? $product->name;
        $product->slug = $request->slug ?? $product->slug;
        $product->category_id = $request->category_id ?? $product->category_id;
        $product->brand_id = $request->brand_id ?? $product->brand_id;
        $product->content = $request->content ?? $product->content;
        $product->description = $request->description ?? $product->description;
        $product->pricebuy = $request->pricebuy ?? $product->pricebuy;

        $product->updated_by = 1; // Cập nhật bởi user (có thể thay thế bằng auth user)
        $product->updated_at = now();
        $product->status = $request->status ?? $product->status;
        $product->save();

        if ($request->hasFile('image')) {
            // Xóa ảnh cũ (nếu cần)
            if ($product->thumbnail && file_exists(public_path('images/product/' . $product->thumbnail))) {
                unlink(public_path('images/product/' . $product->thumbnail));
            }

            $image = $request->file('image');
            $imageName = date('YmdHis') . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $imageName);

            $productImage = ProductImage::where('product_id', $product->id)->first();
            if ($productImage) {
                $productImage->thumbnail = $imageName;
                $productImage->save();
            } else {
                $productImage = new ProductImage();
                $productImage->product_id = $product->id;
                $productImage->thumbnail = $imageName;
                $productImage->save();
            }
         }

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product,
            // 'product_store' => $productStore,
            // 'product_image' => $productImage ?? null
        ]);
 }



public function show($id)
{
    // Sử dụng join để kết hợp dữ liệu từ bảng product, productstore và productimage
    $product = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->join('category', 'product.category_id', '=', 'category.id') // kết nối với bảng productimage có id bằng product_id
        ->select(
            'product.id',
            'product.name',
            'product.slug',
            'product.category_id',
            'product.brand_id',
            'product.content',
            'product.pricebuy',
            'product.description',
            'product.created_at',
            'product.created_by',
            'product.updated_at',
            'product.updated_by',
            'product.status',
            'productimage.thumbnail', // Lấy thumbnail từ bảng productimage
            'productstore.qty',
            'productstore.priceroot',
            'category.name as category_name',
        )
        ->where('product.id', $id)
        ->first();

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ]);
    }

    // Thêm URL đầy đủ cho thumbnail
    $product->thumbnail = url('images/product/' . $product->thumbnail);

    return response()->json([
        'status' => true,
        'message' => 'Tải dữ liệu sản phẩm thành công',
        'product' => $product
    ]);
}
public function updatePStatus(Request $request, $id)
{
    $product = Product::find($id);

    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm',
        ]);
    }

    // Kiểm tra giá trị hợp lệ cho status (1 hoặc 0)
    if (!in_array($request->status, [0, 1])) {
        return response()->json([
            'status' => false,
            'message' => 'Status chỉ nhận giá trị 1 (bật) hoặc 0 (tắt)',
        ]);
    }

    $product->status = $request->status;

    if ($product->save()) {
        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'product' => $product,
        ]);
    } else {
        return response()->json([
            'status' => false,
            'message' => 'Cập nhật thất bại',
        ]);
    }
}

public function destroy($id)
{
    $product = Product::find($id);

    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm',
        ]);
    }

    // Xóa vĩnh viễn sản phẩm
    $product->delete();

    return response()->json([
        'status' => true,
        'message' => 'Đã xóa vĩnh viễn sản phẩm',
    ]);
}
public function restore($id)

    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ]);
        }

        // Khôi phục trạng thái sản phẩm từ thùng rác
        $product->status = 1;
        $product->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục sản phẩm thành công',
            'product' => $product,
        ]);
    }
 public function trash()
{
        $products = Product::where('status', 2)->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách sản phẩm trong thùng rác',
            'products' => $products,
        ]);
}
public function delete($id)
{
    // Tìm sản phẩm theo ID
    $product = Product::find($id);

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy sản phẩm',
        ]);
    }

    // Cập nhật trạng thái của sản phẩm thành 2 để chỉ ra rằng nó đã được đưa vào thùng rác
    $product->status = 2;
    $product->save(); // Lưu thay đổi vào cơ sở dữ liệu

    return response()->json([
        'status' => true,
        'message' => 'Đã chuyển sản phẩm vào thùng rác',
        'product' => $product, // Trả về thông tin sản phẩm
    ]);
}

public function status($id)
{
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ]);
        }

        // Đảo trạng thái của sản phẩm
        $product->status = $product->status == 1 ? 0 : 1;
        $product->save();

        return response()->json([
            'status' => true,
            'message' => 'Thay đổi trạng thái thành công',
            'product' => $product,
        ]);
}



    // Người dùng
    public function product_new($limit)
    {
        $subproductstore=ProductStore::select('product_id',DB::raw('SUM(qty) as qty'))
        ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
        ->joinSub($subproductstore,'productstore',function($join){
            $join->on('product.id','=','productstore.product_id');
        })
        ->leftJoin('productsale',function($json){
            $today=Carbon::now()->format('Y-m-d H:i:s');
            $json->on('product.id','=','productsale.product_id')
            ->where([
                ['productsale.datebegin','<=',$today],
                ['productsale.dateend','>=',$today],
                ['productsale.status','=',1]
            ]);
        })
            ->with('productImages')
            ->orderBy('product.created_at','DESC')
            ->select("product.id","product.name","product.pricebuy","product.slug","productsale.pricesale" )
            ->limit($limit)
            ->get();

            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'products' => $products
            ];
        return response()->json($result);
    }


    public function product_sale($limit)
    {
        $subproductstore=ProductStore::select('product_id',DB::raw('SUM(qty) as qty'))
        ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
        ->joinSub($subproductstore,'productstore',function($join){
            $join->on('product.id','=','productstore.product_id');
        })
        ->join('productsale',function($json){
            $today=Carbon::now()->format('Y-m-d H:i:s');
            $json->on('product.id','=','productsale.product_id')
            ->where([
                ['productsale.datebegin','<=',$today],
                ['productsale.dateend','>=',$today],
                ['productsale.status','=',1]
            ]);
        })
            ->with('productImages')
            ->orderBy('productsale.pricesale','DESC')
            ->select("product.id","product.name","product.pricebuy","product.slug","productsale.pricesale","productsale.datebegin","productsale.dateend" )
            ->limit($limit)
            ->get();

            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'products' => $products
            ];
        return response()->json($result);
    }


    public function product_bestseller($limit)
    {
        $subproductstore=ProductStore::select('product_id',DB::raw('SUM(qty) as qty'))
        ->groupBy('product_id');
        $suborderdetail=OrderDetail::select('product_id',DB::raw('SUM(qty) as qty'))
        ->groupBy('product_id');
        $products = Product::where('product.status', '=', 1)
        ->joinSub($subproductstore,'productstore',function($join){
            $join->on('product.id','=','productstore.product_id');
        })
        ->joinSub($suborderdetail,'orderdetail',function($join){
            $join->on('product.id','=','orderdetail.product_id');
        })
        ->leftJoin('productsale',function($json){
            $today=Carbon::now()->format('Y-m-d H:i:s');
            $json->on('product.id','=','productsale.product_id')
            ->where([
                ['productsale.datebegin','<=',$today],
                ['productsale.dateend','>=',$today],
                ['productsale.status','=',1]
            ]);
        })
            ->with('productImages')
            ->orderBy('orderdetail.qty','DESC')
            ->select("product.id","product.name","product.pricebuy","product.slug","productsale.pricesale","orderdetail.qty" )
            ->limit($limit)
            ->get();

            $result = [
                'status' => true,
                'message' => 'Tải dữ liệu thành công',
                'products' => $products
            ];
        return response()->json($result);
    }

    public function getProductsByCategory(Request $request, $categoryId)
    {
        // Lấy sản phẩm theo danh mục
        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productimage', 'product.id', '=', 'productimage.product_id')
            ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->join('category', 'product.category_id', '=', 'category.id')
            ->select(
                'product.id',
                'product.name',
                'product.slug',
                'product.category_id',
                'product.brand_id',
                'brand.name as brand_name',
                'category.name as category_name',
                'product.content',
                'product.pricebuy',
                'product.description',
                'product.created_at',
                'product.created_by',
                'product.updated_at',
                'product.updated_by',
                'product.status',
                'productimage.thumbnail',
                'productstore.qty',
                'productstore.priceroot'
            )
            ->where('product.status', '!=', 0) // Trạng thái sản phẩm không phải là 0
            ->where('productstore.status', '!=', 2) // Trạng thái kho không phải là 2
            ->where('product.category_id', $categoryId) // Lọc theo category_id
            ->get();

        // Thêm URL đầy đủ cho thumbnail
        foreach ($products as $product) {
            $product->thumbnail = url('images/product/' . $product->thumbnail);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm theo danh mục thành công',
            'products' => $products
        ]);
    }
    public function getProductsByBrand(Request $request, $brandId)
    {
        // Lấy sản phẩm theo thương hiệu
        $products = Product::join('productstore', 'product.id', '=', 'productstore.product_id')
            ->join('productimage', 'product.id', '=', 'productimage.product_id')
            ->join('brand', 'product.brand_id', '=', 'brand.id')
            ->join('category', 'product.category_id', '=', 'category.id')
            ->select(
                'product.id',
                'product.name',
                'product.slug',
                'product.category_id',
                'product.brand_id',
                'brand.name as brand_name',
                'category.name as category_name',
                'product.content',
                'product.pricebuy',
                'product.description',
                'product.created_at',
                'product.created_by',
                'product.updated_at',
                'product.updated_by',
                'product.status',
                'productimage.thumbnail',
                'productstore.qty',
                'productstore.priceroot'
            )
            ->where('product.status', '!=', 0) // Trạng thái sản phẩm không phải là 0
            ->where('productstore.status', '!=', 2) // Trạng thái kho không phải là 2
            ->where('product.brand_id', $brandId) // Lọc theo brand_id
            ->get();

        // Thêm URL đầy đủ cho thumbnail
        foreach ($products as $product) {
            $product->thumbnail = url('images/product/' . $product->thumbnail);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu sản phẩm theo thương hiệu thành công',
            'products' => $products
        ]);
    }


}
