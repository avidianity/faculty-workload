import { ScheduleContract } from '../contracts/schedule.contract';
import { BaseService } from './base.service';

export class ScheduleService extends BaseService<ScheduleContract> {}

export const scheduleService = new ScheduleService('/schedules');
