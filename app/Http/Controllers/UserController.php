<?php

namespace App\Http\Controllers;
use App\Models\User;
use Exception;
use Hash;
use \Illuminate\Http\Request;

class UserController extends Controller
{ 
    public function getSaved(Request $request) {

    }

    public function getUpvoted(Request $request) {
        
    }

    public function registerUser(Request $request) {
        $data = $this->validateRequest($request, [
            "username" => "required|string|max:255|min:5",
            "password" => "required|string|min:8|max:255",
            "email" => "required|email"
        ]);
        
        $user = new User();
        $user->name = $data["username"];
        $user->password = Hash::make($data["password"]);
        $user->email = $data["email"];
        
        try {
            
            $user->save();
            $token = $user->createToken("AppUserToken");
            return response()->json(["token" => $token->plainTextToken]);

        } catch (Exception $e) {
            
            return response()->json([
                'errors' => $e->getMessage(),
            ], 400);
        
        }
    }

    public function login(Request $request) {
        $data = $this->validateRequest($request, [
            "password" => "required|string|min:8|max:255",
            "email" => "required|email"
        ]);

        if (!auth()->attempt(["email" => $data["email"], "password" => $data["password"]])) {
            return abort(response()->json([
                "email" => "Invalid email password compination"
            ], 401));
        }

        $token = auth()->user()->createToken("AppUserToken")->plainTextToken;

        return response()->json(["token" => $token]);
    }
}