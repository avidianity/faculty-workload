import { ModelContract } from './model.contract';

export interface TeacherContract extends ModelContract {
	account_number: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	employment_status: string;
	availability_start: string;
	availability_end: string;
}
