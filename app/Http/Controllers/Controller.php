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
                'error' => $e->getMessage(),
            ], 400));
        }
    }

    public function getUser(Request $request) {
        try {
            $user = $request->user();
            return $user;
        } catch (Exception $e) {
            abort(response()->json([
                'error' => "Unauthorized user",
            ], 401));
        }
    }
}
