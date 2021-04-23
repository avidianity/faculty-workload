import { UserContract } from '../contracts/user.contract';
import { BaseService } from './base.service';

export class UserService extends BaseService<UserContract> {}

export const userService = new UserService('/users');
