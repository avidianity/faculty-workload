<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'email',
    ];

    protected static function booted()
    {
        static::deleting(function (self $teacher) {
            $teacher->schedules()->delete();
        });
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
