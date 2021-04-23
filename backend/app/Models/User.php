<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'confirmed',
        'blocked',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'confirmed' => 'boolean',
        'blocked' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function (self $user) {
            $user->password = Hash::make($user->password);
        });
        static::updating(function (self $user) {
            if ($user->isDirty('password')) {
                $user->password = Hash::make($user->password);
            }
        });
    }
}
