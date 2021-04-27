<?php

namespace App\Exports;

use App\Models\Curriculum;
use Illuminate\Contracts\Support\Responsable;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CurriculumExport implements FromCollection, WithHeadings, Responsable
{
    use Exportable;

    private $fileName = 'curricula.xlsx';

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Curriculum::all();
    }

    public function headings(): array
    {
        $collection = $this->collection();

        return array_keys($collection->count() > 0 ? $collection->first()->toArray() : []);
    }
}
