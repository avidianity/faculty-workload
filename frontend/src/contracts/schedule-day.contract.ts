import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';

export interface ScheduleDayContract extends ModelContract {
	schedule?: ScheduleContract;
	start_time_am: string;
	end_time_am: string;
	start_time_pm: string;
	end_time_pm: string;
	day: string;
}
