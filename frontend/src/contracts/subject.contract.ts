import { CourseContract } from './course.contract';
import { CurriculumContract } from './curriculum.contract';
import { ModelContract } from './model.contract';

export interface SubjectContract extends ModelContract {
	uuid: string;
	prerequisites: string;
	code: string;
	description: string;
	units: number;
	lab_hours: string;
	lec_hours: string;
	semester_1st: boolean;
	semester_2nd: boolean;
	semester_summer: boolean;
	curriculum_id: number;
	years: string[];
	curriculum?: CurriculumContract;
	courses?: CourseContract[];
}
