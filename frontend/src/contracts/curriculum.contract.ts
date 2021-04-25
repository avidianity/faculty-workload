import { ModelContract } from './model.contract';
import { SubjectContract } from './subject.contract';

export interface CurriculumContract extends ModelContract {
	start_year: number;
	end_year: number;
	start_school_date: string;
	end_school_date: string;
	subjects?: SubjectContract[];
}
