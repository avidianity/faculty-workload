<?php

use App\Models\Course;
use App\Models\Room;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignIdFor(new Teacher());
            $table->foreignIdFor(new Subject());
            $table->foreignIdFor(new Room());
            $table->foreignIdFor(new Course());
            $table->enum('semester', [
                '1st Semester',
                '2nd Semester',
                'Summer',
            ]);
            $table->unsignedTinyInteger('slot');
            $table->json('days');
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
        Schema::dropIfExists('schedules');
    }
}
