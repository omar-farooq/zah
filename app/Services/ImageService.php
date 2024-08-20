<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageService {
    function getTemporaryUrl(Request $request) {
        $url = Storage::temporaryUrl('/images/'.$request->name, now()->addMinutes(5));
        return $url;
    }
}
