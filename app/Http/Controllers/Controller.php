<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;


abstract class Controller
{
    use ValidatesRequests;

    protected function validateRequest(Request $request, array $rules) {
        try {
            return $request->validate($rules);
        }
        catch (Exception $e) {
            abort(response()->json([
                'errors' => $e->getMessage(),
            ], 400));
        }
    }

    protected function getUser(Request $request) {
        $user = $request->user();
        if ($user) {
            return $user;
        }
        abort(response()->json([
            'errors' => "Unauthorized user",
        ], 401));        
    }
}
