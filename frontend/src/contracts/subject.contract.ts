import { CourseContract } from './course.contract';
import { CurriculumContract } from './curriculum.contract';
import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';

export interface SubjectContract extends ModelContract {
	uuid: string;
	prerequisites: string;
	code: string;
	description: string;
	units: number;
	lab_hours: number;
	lec_hours: number;
	semester: string;
	curriculum_id: number;
	year: string;
	section: number;
	curriculum?: CurriculumContract;
	course?: CourseContract;
	schedules?: ScheduleContract[];
}
