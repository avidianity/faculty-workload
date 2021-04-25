<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_number',
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
        static::deleting(function (self $teacher) {
            $teacher->schedules()->delete();
        });
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
