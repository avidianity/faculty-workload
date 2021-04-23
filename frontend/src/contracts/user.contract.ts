import { ModelContract } from './model.contract';

export interface UserContract extends ModelContract {
	name: string;
	email: string;
	blocked: boolean;
	confirmed: boolean;
	password: string;
}
