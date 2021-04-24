<?php

namespace App\Models;

use App\Casts\JSON;
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
        'semester_1st',
        'semester_2nd',
        'semester_summer',
        'curriculum_id',
        'years',
    ];

    protected $casts = [
        'years' => JSON::class,
        'semester_1st' => 'boolean',
        'semester_2nd' => 'boolean',
        'semester_summer' => 'boolean',
    ];

    protected static function booted()
    {
        static::deleting(function (self $subject) {
            $subject->schedules()->delete();
        });
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class)->withTimestamps();
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
