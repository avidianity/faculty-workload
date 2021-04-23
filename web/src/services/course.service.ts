import { CourseContract } from '../contracts/course.contract';
import { BaseService } from './base.service';

export class CourseService extends BaseService<CourseContract> {}

export const courseService = new CourseService('/courses');
