import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';

export interface TeacherContract extends ModelContract {
	account_number: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	employment_status: string;
	start_time_am?: string;
	end_time_am?: string;
	start_time_pm?: string;
	end_time_pm?: string;
	schedules?: ScheduleContract[];
	days: string[];
}
