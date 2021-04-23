import { ModelContract } from './model.contract';

export interface TeacherContract extends ModelContract {
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
}
