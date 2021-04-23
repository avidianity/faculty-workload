import { RoomContract } from '../contracts/room.contract';
import { BaseService } from './base.service';

export class RoomService extends BaseService<RoomContract> {}

export const roomService = new RoomService('/rooms');
