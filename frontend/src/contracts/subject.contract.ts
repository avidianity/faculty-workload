import { CourseContract } from './course.contract';
import { CurriculumContract } from './curriculum.contract';
import { ModelContract } from './model.contract';

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
	section: string;
	curriculum?: CurriculumContract;
	course?: CourseContract;
}
