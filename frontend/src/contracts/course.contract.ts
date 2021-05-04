import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';
import { SubjectContract } from './subject.contract';

export interface CourseContract extends ModelContract {
	uuid: string;
	code: string;
	description: string;
	subjects?: SubjectContract[];
	schedules?: ScheduleContract[];
}
