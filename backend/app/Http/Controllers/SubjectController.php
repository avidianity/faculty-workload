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
        return Subject::with('courses', 'curriculum')->get();
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

        $subject->courses()->sync(Course::findMany(collect($data['courses'])->map(function ($course) {
            return $course['id'];
        })));

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
        $subject->load('courses', 'curriculum');
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

        $subject->courses()->sync(Course::findMany(collect($request->get('courses', []))->map(function ($course) {
            return $course['id'];
        })));

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
            'semester_1st',
            'semester_2nd',
            'semester_summer',
            'curriculum_id',
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
