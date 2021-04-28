import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';

export interface ScheduleDayContract extends ModelContract {
	schedule?: ScheduleContract;
	start_time: string;
	end_time: string;
	day: string;
}
