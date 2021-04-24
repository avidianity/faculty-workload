<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'email',
        'employment_status',
        'availability_start',
        'availability_end',
    ];

    protected static function booted()
    {
        static::creating(function (self $teacher) {
            $teacher->account_number = sprintf(
                '%s-%s-%s',
                Str::padLeft((string)rand(0, 99999), 5, '0'),
                Str::padLeft((string)rand(0, 99999), 5, '0'),
                Str::padLeft((string)rand(0, 99999), 5, '0')
            );
        });

        static::deleting(function (self $teacher) {
            $teacher->schedules()->delete();
        });
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
