<?php

use App\Models\Course;
use App\Models\Curriculum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('prerequisites');
            $table->string('code');
            $table->string('description');
            $table->unsignedTinyInteger('units');
            $table->unsignedSmallInteger('lab_hours');
            $table->unsignedSmallInteger('lec_hours');
            $table->foreignIdFor(new Curriculum())->constrained();
            $table->foreignIdFor(new Course())->constrained();
            $table->string('semester');
            $table->string('year');
            $table->unsignedInteger('section');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subjects');
    }
}
