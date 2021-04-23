import { TeacherContract } from '../contracts/teacher.contract';
import { BaseService } from './base.service';

export class TeacherService extends BaseService<TeacherContract> {}

export const teacherService = new TeacherService('/teachers');
