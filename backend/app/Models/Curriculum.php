<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'start_school_date',
        'end_school_date',
    ];

    protected $casts = [
        'start_school_date' => 'datetime',
        'end_school_date' => 'datetime',
    ];

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}
