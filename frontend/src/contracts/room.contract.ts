import { ModelContract } from './model.contract';

export interface RoomContract extends ModelContract {
	uuid: string;
	name: string;
	description: string;
}
