<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CurriculumController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Curriculum::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $curriculum = Curriculum::whereYear('start_school_date', Carbon::parse($data['start_school_date'])->year)
            ->whereYear('end_school_date', Carbon::parse($data['end_school_date'])->year)
            ->whereStartYear($data['start_year'])
            ->whereEndYear($data['end_year'])
            ->first();

        if ($curriculum) {
            return response(['message' => 'Curriculum already exists.'], 400);
        }

        return Curriculum::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Curriculum $curriculum
     * @return \Illuminate\Http\Response
     */
    public function show(Curriculum $curriculum)
    {
        return $curriculum;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Curriculum $curriculum
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Curriculum $curriculum)
    {
        $data = $request->all();

        $exists = Curriculum::whereYear('start_school_date', Carbon::parse($data['start_school_date'])->year)
            ->whereYear('end_school_date', Carbon::parse($data['end_school_date'])->year)
            ->whereStartYear($data['start_year'])
            ->whereEndYear($data['end_year'])
            ->where('id', '!=', $curriculum->id)
            ->first();

        if ($exists) {
            return response(['message' => 'Curriculum already exists.'], 400);
        }

        $curriculum->update($data);

        return $curriculum;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Curriculum $curriculum
     * @return \Illuminate\Http\Response
     */
    public function destroy(Curriculum $curriculum)
    {
        $curriculum->delete();

        return response('', 204);
    }
}
