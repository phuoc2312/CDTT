<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use App\Http\Requests\StoreTopicRequest;
use App\Http\Requests\UpdateTopicRequest;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    // Lấy danh sách các chủ đề không có trạng thái là 2 (đã xóa)
    public function index()
    {
        $topics = Topic::where('status', '!=', 2)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "description", "status")
            ->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topics' => $topics
        ];

        return response()->json($result);
    }

    // Lấy danh sách các chủ đề trong thùng rác (status = 2)
    public function trash()
    {
        $topics = Topic::where('status', '=', 2)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "description", "status")
            ->get();

        $result = [
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'topics' => $topics
        ];

        return response()->json($result);
    }

    // Hiển thị thông tin một chủ đề theo ID
    public function show($id)
    {
        // Join bảng topics với bảng posts để lấy bài viết theo topic_id
        $topicWithPosts = Topic::where('topic.id', $id)
            ->join('post', 'topic.id', '=', 'post.topic_id')
            ->select('topic.*', 'post.id as post_id', 'post.title', 'post.content', 'post.created_at','post.thumbnail')
            ->get();

        if ($topicWithPosts->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'topic' => null
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'data' => $topicWithPosts
        ]);
    }


    // Thêm mới một chủ đề
    public function store(StoreTopicRequest $request)
    {
        $topic = new Topic();
        $topic->name = $request->name;
        $topic->slug = $request->slug;
        $topic->description = $request->description;
        $topic->sort_order = $request->sort_order;

        // Lấy trạng thái từ request, nếu không có thì mặc định là 1
        $topic->status = $request->status ?? 1;
        $topic->created_by = 1;
        $topic->created_at = now();

        if ($topic->save()) {
            $result = [
                'status' => true,
                'message' => 'Thêm thành công',
                'topic' => $topic
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Thêm thất bại',
                'topic' => null
            ];
        }

        return response()->json($result);
    }

    // Cập nhật thông tin một chủ đề
    public function update(UpdateTopicRequest $request, $id)
    {
        $topic = Topic::find($id);

        if ($topic == null) {
            $result = [
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'topic' => null
            ];
        } else {
            $topic->name = $request->name;
            $topic->slug = $request->slug;
            $topic->description = $request->description;
            $topic->sort_order = $request->sort_order;
            $topic->status = $request->status;
            $topic->updated_by = 1;
            $topic->updated_at = now();
            $topic->save();

            $result = [
                'status' => true,
                'message' => 'Sửa thành công',
                'topic' => $topic
            ];
        }

        return response()->json($result);
    }

    // Thay đổi trạng thái của chủ đề (bật/tắt)
    public function toggleStatus($id)
    {
        $topic = Topic::find($id);

        if ($topic == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề'
            ]);
        }

        // Thay đổi trạng thái từ 1 -> 0 hoặc 0 -> 1
        $topic->status = $topic->status == 1 ? 0 : 1;
        $topic->updated_by = 1;
        $topic->updated_at = now();
        $topic->save();

        return response()->json([
            'status' => true,
            'message' => 'Thay đổi trạng thái thành công',
            'topic' => $topic
        ]);
    }


    public function restore($id)
    {
        $topic = Topic::find($id);

        if ($topic == null || $topic->status != 2) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề hoặc chủ đề không bị vô hiệu hóa'
            ]);
        }

        $topic->status = 1; // Khôi phục lại trạng thái hoạt động
        $topic->updated_by = 1;
        $topic->updated_at = now();
        $topic->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục dữ liệu thành công',
            'topic' => $topic
        ]);
    }
    public function delete($id)
{
    $topic = Topic::find($id);

    if (!$topic) {
        return response()->json(['message' => 'Topic not found'], 404);
    }

    // Update the topic status to 2 for moving to trash
    $topic->status = 2;
    $topic->save();

    return response()->json(['message' => 'Topic moved to trash successfully'], 200);
}
public function destroy($id)
{
    $topic = Topic::find($id);

    if ($topic == null) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy chủ đề'
        ]);
    }

    // Permanently delete the topic from the database
    $topic->delete();

    return response()->json([
        'status' => true,
        'message' => 'Xóa dữ liệu thành công'
    ]);
}

}
