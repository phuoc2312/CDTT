<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Contact;
class ContactController extends Controller
{
    // Hiển thị danh sách tất cả các contact
    public function index()
    {
        try {
            $contacts = Contact::select(
                'id',
                'user_id',
                'title',
                'content',
                'reply_id',
                'created_at',
                'created_by',
                'updated_at',
                'updated_by',
                'status'
            )->get();

            return response()->json($contacts, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }


    // Hiển thị chi tiết một contact cụ thể
    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        return view('contact.show', compact('contact'));
    }

    // Xử lý trả lời một contact
    public function reply(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->reply_id = $request->reply_id; // Gán ID của phản hồi
        $contact->status = 1; // Cập nhật trạng thái đã xử lý
        $contact->updated_by = Auth::id(); // Gán người trả lời
        $contact->save();

        return redirect()->back()->with('success', 'Đã trả lời liên hệ thành công');
    }

    // Thay đổi trạng thái của contact (chưa xử lý hoặc đã xử lý)
    public function status($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->status = !$contact->status; // Đổi trạng thái giữa 0 và 1
        $contact->updated_by = Auth::id();
        $contact->save();

        return redirect()->back()->with('success', 'Trạng thái liên hệ đã được cập nhật');
    }

    // Xóa mềm contact (chuyển vào thùng rác)
    public function delete($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete(); // Sử dụng soft delete

        return redirect()->back()->with('success', 'Liên hệ đã được chuyển vào thùng rác');
    }

    // Khôi phục contact từ thùng rác
    public function restore($id)
    {
        $contact = Contact::withTrashed()->findOrFail($id);
        $contact->restore(); // Khôi phục từ soft delete

        return redirect()->back()->with('success', 'Liên hệ đã được khôi phục');
    }

    // Xóa vĩnh viễn contact
    public function destroy($id)
    {
        $contact = Contact::withTrashed()->findOrFail($id);
        $contact->forceDelete(); // Xóa vĩnh viễn

        return redirect()->back()->with('success', 'Liên hệ đã được xóa vĩnh viễn');
    }

    // Hiển thị các liên hệ trong thùng rác
    public function trash()
    {
        $contacts = Contact::onlyTrashed()->get(); // Lấy những contact đã xóa mềm
        return view('contact.trash', compact('contacts'));
    }

    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $contact = new Contact();
        $contact->user_id = $request->user_id; // Lưu user_id thay vì email
        $contact->title = $request->title; // Đổi từ 'name' thành 'title'
        $contact->content = $request->content; // Đổi từ 'message' thành 'content'
        $contact->created_by = 1; // Hoặc lấy từ user hiện tại
        $contact->status = 0; // Mặc định là chưa xử lý
        $contact->save();

        // Đảm bảo trả về phản hồi với message
        return response()->json(['message' => 'Liên hệ đã được thêm thành công'], 201);
    }


}
