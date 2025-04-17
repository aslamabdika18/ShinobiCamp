<?php

namespace App\Http\Responses;

use App\Models\User; // Tambahkan import model User
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user) {
            return new JsonResponse([
                'success' => true,
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'message' => 'User not authenticated',
        ], 401);
    }
}
