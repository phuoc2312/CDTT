<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class UpdatePostRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'title' => 'required',
            'slug' => 'required',
            'topic_id' => 'exists:topic,id',
            'content' => 'required',
        ];

    }
    public function messages(): array
    {
        return [
            'title.required' => 'Tên không được để trống',
            'slug.required'=>'Slug không được để trống',
            'content.required'=>'Nội dung không được để trống',
            'topic_id.exists' => 'Chủ đề không hợp lệ',

        ];
    }

    public function failedValidation(Validator $validator)
    {
            throw new HttpResponseException(response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'posts' => $validator->errors()
            ]));
    }


}