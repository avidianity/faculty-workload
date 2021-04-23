import { SubjectContract } from '../contracts/subject.contract';
import { BaseService } from './base.service';

export class SubjectService extends BaseService<SubjectContract> {}

export const subjectService = new SubjectService('/subjects');
