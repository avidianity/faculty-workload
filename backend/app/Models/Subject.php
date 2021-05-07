<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'prerequisites',
        'code',
        'description',
        'units',
        'lab_hours',
        'lec_hours',
        'semester',
        'curriculum_id',
        'year',
        'course_id',
        'section',
    ];

    protected static function booted()
    {
        static::deleting(function (self $subject) {
            $subject->schedules()->delete();
        });
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }
}
