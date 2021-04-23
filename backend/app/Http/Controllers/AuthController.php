<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $user = User::whereEmail($data['email'])->first();

        if (!$user) {
            return response(['message' => 'Email does not exist.'], 403);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Incorrect password.'], 403);
        }

        if (!$user->confirmed) {
            return response(['message' => 'Account is not yet confirmed.'], 403);
        }

        if ($user->blocked) {
            return response(['message' => 'Account is currently blocked.'], 403);
        }

        $token = $user->createToken(Str::random(10));

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function logout(Request $request)
    {
        /**
         * @var User
         */
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('', 204);
    }
}
