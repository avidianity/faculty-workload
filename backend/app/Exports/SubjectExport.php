<?php

namespace App\Exports;

use App\Models\Subject;
use Illuminate\Contracts\Support\Responsable;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SubjectExport implements FromCollection, WithHeadings, Responsable
{
    use Exportable;

    private $fileName = 'subject-offerings.xlsx';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Subject::all();
    }

    public function headings(): array
    {
        $collection = $this->collection();

        return array_keys($collection->count() > 0 ? $collection->first()->toArray() : []);
    }
}
