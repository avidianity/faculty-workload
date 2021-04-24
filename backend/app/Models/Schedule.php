<?php

namespace App\Models;

use App\Casts\JSON;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_time',
        'end_time',
        'teacher_id',
        'subject_id',
        'room_id',
        'course_id',
        'semester',
        'slot',
        'days',
    ];

    protected $casts = [
        'days' => JSON::class,
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
