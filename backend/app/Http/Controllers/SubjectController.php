<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Subject::with('course', 'curriculum', 'schedules')->get();
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

        if (!$this->validateSubject($data)) {
            return response(['message' => 'Subject already exists.'], 403);
        }

        $subject = Subject::create($data);

        return $subject;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function show(Subject $subject)
    {
        $subject->load('course', 'curriculum', 'schedules');
        return $subject;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Subject $subject)
    {
        $data = $request->all();

        if (!$this->validateSubject($data, ['id' => $subject->id])) {
            return response(['message' => 'Subject already exists.'], 403);
        }

        $subject->update($data);

        return $subject;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response('', 204);
    }

    protected function validateSubject($data, $exceptions = [])
    {
        $builder = new Subject();

        $fields = [
            'semester',
            'year',
            'course_id',
            'curriculum_id',
            'code',
            'description',
        ];

        foreach ($fields as $field) {
            $builder = $builder->where($field, $data[$field]);
        }

        foreach ($exceptions as $field => $exception) {
            $builder = $builder->where($field, '!=', $exception);
        }

        $builder2 = new Subject();

        $fields = [
            'semester',
            'course_id',
            'code',
            'description',
            'section',
            'code',
        ];

        foreach ($fields as $field) {
            $builder2 = $builder2->where($field, $data[$field]);
        }

        foreach ($exceptions as $field => $exception) {
            $builder2 = $builder2->where($field, '!=', $exception);
        }

        return $builder->count() === 0 && $builder2->count() === 0;
    }
}
