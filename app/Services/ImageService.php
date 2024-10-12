<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function getTemporaryUrl(Request $request)
    {
        $url = config('app.env') == 'production' ? Storage::temporaryUrl('images/'.$request->name, now()->addMinutes(5)) : Storage::url('images/'.$request->name);

        return $url;
    }
}
