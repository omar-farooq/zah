<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaintenanceRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'required_maintenance' => 'required|max:255',
            'reason' => 'required|max:255',
            'cost' => 'required|numeric',
            'contractor' => 'required',
            'contractor_email' => 'email',
            'type' => 'required',
            'start' => 'required|date',
            'finish' => 'date'
        ];
    }
}
