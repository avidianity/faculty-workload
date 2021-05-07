<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;
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
        return Schedule::with('teacher', 'room', 'subject.curriculum', 'days', 'subject.course')->get();
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
            return response(['message' => 'Schedule already exists.'], 400);
        }

        $schedule = Schedule::create($data);

        $schedule->days()->createMany($data['days']);

        return $schedule;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
        $schedule->load('teacher', 'room', 'subject.curriculum', 'days', 'subject.course');
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
            return response(['message' => 'Schedule already exists.'], 400);
        }

        $schedule->update($data);

        $schedule->days()->delete();

        $schedule->days()->createMany($data['days']);

        $schedule->load('teacher', 'room', 'subject.curriculum', 'days');

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

        $fields = [
            'teacher_id',
            'subject_id',
            'room_id',
        ];

        foreach ($fields as $field) {
            $builder = new Schedule();

            foreach ($exceptions as $field => $exception) {
                $builder = $builder->where($field, '!=', $exception);
            }

            $teacher = Teacher::findOrFail($data['teacher_id']);

            foreach ($data['days'] as $day) {
                $count = $builder
                    ->where($field, $data[$field])
                    ->whereHas('days', function (Builder $builder) use ($day) {
                        return $builder->where('day', $day['day'])
                            ->where(function (Builder $query) use ($day) {
                                return $query->orWhere('start_time', '>=', $day['start_time'])
                                    ->orWhere('end_time', '<=', $day['end_time']);
                            });
                    })->count();

                if ($count !== 0) {
                    return false;
                }
            }
        }

        return true;
    }
}
