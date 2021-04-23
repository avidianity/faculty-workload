import { ModelContract } from './model.contract';

export interface SubjectContract extends ModelContract {
	uuid: string;
	code: string;
	description: string;
	units: number;
}
