<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'code',
        'description',
        'units',
    ];

    protected static function booted()
    {
        static::deleting(function (self $subject) {
            $subject->schedules()->delete();
        });
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
