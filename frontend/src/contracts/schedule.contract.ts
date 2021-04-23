import { ModelContract } from './model.contract';
import { RoomContract } from './room.contract';
import { SubjectContract } from './subject.contract';
import { TeacherContract } from './teacher.contract';

export interface ScheduleContract extends ModelContract {
	start_time: string;
	end_time: string;
	teacher_id: number;
	subject_id: number;
	room_id: number;
	teacher?: TeacherContract;
	subject?: SubjectContract;
	room?: RoomContract;
}
