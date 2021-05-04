import { ModelContract } from './model.contract';
import { SubjectContract } from './subject.contract';

export interface CurriculumContract extends ModelContract {
	description: string;
	start_school_date: string;
	end_school_date: string;
	subjects?: SubjectContract[];
}
