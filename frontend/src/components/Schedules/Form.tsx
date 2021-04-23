import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { ScheduleContract } from '../../contracts/schedule.contract';
import { handleError, setValues } from '../../helpers';
import { useArray, useMode, useNullable } from '../../hooks';
import { scheduleService } from '../../services/schedule.service';
import Flatpickr from 'react-flatpickr';
import { RoomContract } from '../../contracts/room.contract';
import { TeacherContract } from '../../contracts/teacher.contract';
import { SubjectContract } from '../../contracts/subject.contract';
import { roomService } from '../../services/room.service';
import { subjectService } from '../../services/subject.service';
import { teacherService } from '../../services/teacher.service';
import dayjs from 'dayjs';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [rooms, setRooms] = useArray<RoomContract>();
	const [teachers, setTeachers] = useArray<TeacherContract>();
	const [subjects, setSubjects] = useArray<SubjectContract>();
	const { register, handleSubmit, setValue } = useForm<ScheduleContract>();
	const [startTime, setStartTime] = useNullable<Date>();
	const [endTime, setEndTime] = useNullable<Date>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: ScheduleContract) => {
		setProcessing(true);
		try {
			if (startTime) {
				payload.start_time = dayjs(startTime).format('HH:mm:ss');
			}

			if (endTime) {
				payload.end_time = dayjs(endTime).format('HH:mm:ss');
			}

			await (mode === 'Add' ? scheduleService.create(payload) : scheduleService.update(id, payload));
			toastr.info('Schedule saved successfully.', 'Notice');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchSchedule = async () => {
		try {
			const schedule = await scheduleService.fetchOne(match.params.id);
			setID(schedule.id!);

			setValues(schedule, setValue);
			setStartTime(dayjs(schedule.start_time, 'HH:mm:ss').toDate());
			setEndTime(dayjs(schedule.end_time, 'HH:mm:ss').toDate());
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const fetchRooms = async () => {
		try {
			setRooms(await roomService.fetch());
		} catch (error) {
			handleError(error);
		}
	};

	const fetchSubjects = async () => {
		try {
			setSubjects(await subjectService.fetch());
		} catch (error) {
			handleError(error);
		}
	};

	const fetchTeachers = async () => {
		try {
			setTeachers(await teacherService.fetch());
		} catch (error) {
			handleError(error);
		}
	};

	const fetchRequirements = async () => {
		await Promise.all([fetchRooms(), fetchSubjects(), fetchTeachers()]);
	};

	useEffect(() => {
		fetchRequirements().then(() => {
			if (match.path.includes('edit')) {
				fetchSchedule();
			}
		});
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Schedule</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='start_time'>Start Time</label>
							<Flatpickr
								options={{
									enableTime: true,
									noCalendar: true,
								}}
								value={startTime || undefined}
								onChange={(dates) => {
									if (dates.length > 0) {
										setStartTime(dates[0]);
									}
								}}
								name='start_time'
								id='start_time'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='end_time'>End Time</label>
							<Flatpickr
								options={{
									enableTime: true,
									noCalendar: true,
								}}
								value={endTime || undefined}
								onChange={(dates) => {
									if (dates.length > 0) {
										setEndTime(dates[0]);
									}
								}}
								name='end_time'
								id='end_time'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='room_id'>Room</label>
							<select {...register('room_id')} name='room_id' id='room_id' className='form-control'>
								<option> -- Select -- </option>
								{rooms.map((room, index) => (
									<option value={room.id} key={index}>
										{room.name}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='teacher_id'>Teacher</label>
							<select {...register('teacher_id')} name='teacher_id' id='teacher_id' className='form-control'>
								<option> -- Select -- </option>
								{teachers.map((teacher, index) => (
									<option value={teacher.id} key={index}>
										{teacher?.last_name}, {teacher.first_name} {teacher.middle_name}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='subject_id'>Subject</label>
							<select {...register('subject_id')} name='subject_id' id='subject_id' className='form-control'>
								<option> -- Select -- </option>
								{subjects.map((subject, index) => (
									<option value={subject.id} key={index}>
										{subject.code}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12'>
							<button type='submit' className='btn btn-primary' disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
