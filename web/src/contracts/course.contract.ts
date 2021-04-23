import { ModelContract } from './model.contract';

export interface CourseContract extends ModelContract {
	uuid: string;
	name: string;
	description: string;
	year: number;
}
