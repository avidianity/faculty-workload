<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Teacher::all();
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

        $teacher = Teacher::whereAccountNumber($data['account_number'])->first();

        if ($teacher) {
            return response(['message' => 'Account number already exists.'], 400);
        }

        $teacher = Teacher::whereFirstName($data['first_name'])
            ->whereLastName($data['last_name'])
            ->first();

        if ($teacher) {
            return response(['message' => 'Teacher already exists.'], 400);
        }

        return Teacher::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Teacher  $teacher
     * @return \Illuminate\Http\Response
     */
    public function show(Teacher $teacher)
    {
        return $teacher;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Teacher  $teacher
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Teacher $teacher)
    {
        $data = $request->all();

        $exists = Teacher::whereFirstName($data['first_name'])
            ->whereLastName($data['last_name'])
            ->where('id', '!=', $teacher->id)
            ->first();

        if ($exists) {
            return response(['message' => 'Teacher already exists.'], 400);
        }

        $teacher->update($data);

        return $teacher;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Teacher  $teacher
     * @return \Illuminate\Http\Response
     */
    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return response('', 204);
    }

    public function search(Request $request)
    {
        return Teacher::search($request->input('query'))
            ->with([
                'schedules.subject.curriculum',
                'schedules.subject.course',
                'schedules.room',
                'schedules.days',
            ])->get();
    }
}
