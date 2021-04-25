<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Schedule::with('teacher', 'room', 'subject.curriculum', 'course')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        if (!$this->validateSchedule($data)) {
            return response(['message' => 'Schedule already exists.']);
        }

        return Schedule::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
        $schedule->load('teacher', 'room', 'subject.curriculum', 'course');
        return $schedule;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Schedule $schedule)
    {
        $data = $request->all();

        if (!$this->validateSchedule($data, ['id' => $schedule->id])) {
            return response(['message' => 'Schedule already exists.']);
        }

        $schedule->update($data);

        $schedule->load('teacher', 'room', 'subject.curriculum', 'course');

        return $schedule;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response('', 204);
    }

    protected function validateSchedule($data, $exceptions = [])
    {
        $builder = new Schedule();

        $fields = [
            'teacher_id',
            'subject_id',
            'room_id',
            'course_id',
        ];

        foreach ($fields as $field) {
            $builder = $builder->where($field, $data[$field]);
        }

        foreach ($exceptions as $field => $exception) {
            $builder = $builder->where($field, '!=', $exception);
        }

        return $builder->count() === 0;
    }
}
