import { CurriculumContract } from '../contracts/curriculum.contract';
import { BaseService } from './base.service';

export class CurriculumService extends BaseService<CurriculumContract> {}

export const curriculumService = new CurriculumService('/curricula');
