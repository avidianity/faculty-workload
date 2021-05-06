<?php

namespace App\Exports;

use App\Models\Teacher;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Contracts\Support\Responsable;

class TeacherScheduleExport implements FromCollection, WithHeadings, Responsable
{
    use Exportable;

    private $fileName;
    protected $teacher;

    public function __construct(Teacher $teacher)
    {
        $this->teacher = $teacher;
        $this->fileName = sprintf('%s, %s.xlsx', $teacher->last_name, $teacher->first_name);
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->teacher
            ->schedules
            ->load('teacher', 'room', 'subject.curriculum', 'subject.course', 'days')
            ->toExportable()
            ->map(function (array $data) {
                $data['course'] = $data['subject']['course']['code'];
                $data['subject'] = $data['subject']['code'];
                $data['days'] = collect($data['days'])->map(function ($day) {
                    return $day['day'];
                })->join(', ');
                $data['room'] = $data['room']['code'];
                $data['teacher'] = sprintf('%s, %s', $data['teacher']['last_name'], $data['teacher']['first_name']);
                return $data;
            });
    }

    public function headings(): array
    {
        $collection = $this->collection();

        return array_keys($collection->count() > 0 ? $collection->first() : []);
    }
}
