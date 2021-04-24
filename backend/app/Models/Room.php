<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'code',
    ];

    protected static function booted()
    {
        static::deleting(function (self $room) {
            $room->schedules()->delete();
        });
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
