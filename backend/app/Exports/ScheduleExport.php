<?php

namespace App\Exports;

use App\Models\Schedule;
use Illuminate\Contracts\Support\Responsable;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ScheduleExport implements FromCollection, WithHeadings, Responsable
{
    use Exportable;

    private $fileName = 'schedules.xlsx';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Schedule::with('teacher', 'room', 'subject.curriculum', 'subject.course', 'days')
            ->get()
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
