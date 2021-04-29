import { ModelContract } from './model.contract';

export interface UserContract extends ModelContract {
	photo_url: string;
	name: string;
	email: string;
	blocked: boolean;
	confirmed: boolean;
	password: string;
	hint: string;
	role: string;
}
