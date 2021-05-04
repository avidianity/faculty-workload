<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Course::all();
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

        if (!$this->validateCourse($data)) {
            return response(['message' => 'Course already exists.'], 403);
        }

        return Course::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function show(Course $course)
    {
        return $course;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Course $course)
    {
        $data = $request->all();

        if (!$this->validateCourse($data, ['id' => $course->id])) {
            return response(['message' => 'Course already exists.'], 403);
        }

        $course->update($data);

        return $course;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return response('', 204);
    }

    protected function validateCourse($data, $exceptions = [])
    {
        $builder = new Course();

        $fields = [
            'code',
            'description',
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
