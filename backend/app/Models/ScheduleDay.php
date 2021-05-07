<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'day',
        'start_time_am',
        'end_time_am',
        'start_time_pm',
        'end_time_pm',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
