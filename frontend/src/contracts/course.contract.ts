import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';
import { SubjectContract } from './subject.contract';

export interface CourseContract extends ModelContract {
	uuid: string;
	code: string;
	description: string;
	year: number;
	section: number;
	subjects?: SubjectContract[];
	schedules?: ScheduleContract[];
}
