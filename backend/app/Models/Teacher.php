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

    protected $searchable = ['account_number', 'first_name', 'last_name', 'middle_name', 'email'];

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

    public function getSearchable()
    {
        return $this->searchable;
    }

    public static function search($keyword)
    {
        $builder = new static();

        foreach ($builder->getSearchable() as $key) {
            $builder = $builder->orWhere($key, 'LIKE', "%{$keyword}%");
        }

        return $builder;
    }
}
