import { CourseContract } from './course.contract';
import { ModelContract } from './model.contract';
import { RoomContract } from './room.contract';
import { ScheduleDayContract } from './schedule-day.contract';
import { SubjectContract } from './subject.contract';
import { TeacherContract } from './teacher.contract';

export interface ScheduleContract extends ModelContract {
	teacher_id: number;
	subject_id: number;
	room_id: number;
	course_id: number;
	semester: string;
	slot: number;
	days: ScheduleDayContract[];
	teacher?: TeacherContract;
	subject?: SubjectContract;
	room?: RoomContract;
	course?: CourseContract;
	section: number;
}
