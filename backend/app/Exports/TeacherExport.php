<?php

namespace App\Exports;

use App\Models\Teacher;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TeacherExport implements FromCollection, WithHeadings, Responsable
{
    use Exportable;

    private $fileName = 'teachers.xlsx';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Teacher::all()->toExportable();
    }

    public function headings(): array
    {
        $collection = $this->collection();

        return array_keys($collection->count() > 0 ? $collection->first() : []);
    }
}
