<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class BusinessRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullName' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'unique:users,phone'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],

            'storeName' => ['required', 'string', 'max:255', 'unique:stores,name'],
            'address' => ['required', 'string', 'max:255'],
            'storePhone' => ['required', 'string', 'max:20', 'unique:stores,phone'],
            'storeEmail' => ['required', 'email', 'max:255', 'unique:stores,email'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'fullName.required' => 'Full name is required.',
            'phone.required' => 'Phone number is required.',
            'phone.unique' => 'This phone number already exists.',

            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email already exists.',

            'password.required' => 'Password is required.',
            'password.confirmed' => 'Password confirmation does not match.',

            'storeName.required' => 'Store name is required.',
            'storeName.unique' => 'This store name already exists.',

            'address.required' => 'Address is required.',

            'storePhone.required' => 'Store phone number is required.',
            'storePhone.unique' => 'This store phone number already exists.',

            'storeEmail.required' => 'Store email is required.',
            'storeEmail.email' => 'Please enter a valid store email address.',
            'storeEmail.unique' => 'This store email already exists.',

            'logo.image' => 'The logo must be an image.',
            'logo.mimes' => 'The logo must be a JPG, JPEG, PNG, or WEBP image.',
            'logo.max' => 'The logo must not be larger than 2MB.',
        ];
    }
}
