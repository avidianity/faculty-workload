<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleDay extends Model
{
    use HasFactory;

    protected $fillable = ['day', 'start_time', 'end_time'];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
