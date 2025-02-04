<?php

namespace App\Http\Controllers;
use App\Models\User;
use Exception;
use Hash;
use \Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{ 
    public function getSaved(Request $request) {
        $user = $this->getUser($request);
        return response()->json($user->saves()->get());
    }

    public function getUpvoted(Request $request) {
        $user = $this->getUser($request);
        return response()->json($user->likes()->get());
    }

    public function registerUser(Request $request) {
        $data = $this->validateRequest($request, [
            "username" => "required|string|max:255|min:5",
            "password" => "required|string|min:8|max:255",
            "email" => "required|email|unique:users"
        ]);
        
        $user = User::create([
            'name' => $data["username"],
            'email' => $data["email"],
            'password' => Hash::make($data["password"]),
        ]);

        try {
            
            $user->save();
            return;

        } catch (Exception $e) {
            
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        
        }
    }

    public function login(Request $request) {
        $this->validateRequest($request, [
            "password" => "required|string|min:8|max:255",
            "email" => "required|email"
        ]);
        
        $user = User::where('email', '=', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Email password combination is incorrect, try again'], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken("AppUserToken", ['*'], now()->addMonth())->plainTextToken;
        return response()->json(["token" => $token]);
    }


    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
    }
}