<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'code',
        'description',
        'year',
        'section',
    ];

    protected $casts = [
        'year' => 'integer',
        'section' => 'integer',
    ];

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
