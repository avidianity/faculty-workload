import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { scheduleService } from '../../services/schedule.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { roomService } from '../../services/room.service';
import { subjectService } from '../../services/subject.service';
import { teacherService } from '../../services/teacher.service';
import { courseService } from '../../services/course.service';
import { SubjectContract } from '../../contracts/subject.contract';
import { TeacherContract } from '../../contracts/teacher.contract';
import { CourseContract } from '../../contracts/course.contract';

type Props = {};

type Inputs = {
	start_time: string;
	end_time: string;
	teacher_id: number;
	subject_id: number;
	room_id: number;
	course_id: number;
	semester: string;
	slot: number;
	days: string[];
};

type Selected = {
	subject?: SubjectContract;
	teacher?: TeacherContract;
	course?: CourseContract;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { data: rooms } = useQuery('rooms', () => roomService.fetch());
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const { data: teachers } = useQuery('teachers', () => teacherService.fetch());
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const [selected, setSelected] = useState<Selected>({});
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [startTime, setStartTime] = useNullable<Date>();
	const [endTime, setEndTime] = useNullable<Date>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: Inputs) => {
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

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchSchedule();
		}
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
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='subject_id'>Subject</label>
							<select
								{...register('subject_id')}
								name='subject_id'
								id='subject_id'
								className='form-control'
								onChange={(e) => {
									const subject = subjects?.find((subject) => subject.id === e.target.value.toNumber());

									if (subject) {
										setSelected({ ...selected, subject });
									}
								}}
								disabled={processing}>
								{subjects?.map((subject, index) => (
									<option value={subject.id} key={index}>
										{subject.description}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label>Curriculum Year</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={
									selected.subject
										? `${selected.subject?.curriculum?.start_year} - ${selected.subject?.curriculum?.end_year}`
										: ''
								}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label>School Year</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={
									selected.subject
										? `${dayjs(selected.subject?.curriculum?.start_school_date).format('YYYY')} - ${dayjs(
												selected.subject?.curriculum?.end_school_date
										  ).format('YYYY')}`
										: ''
								}
							/>
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

// const t = (
// 	<>
// 		<div className='form-group col-12 col-md-6'>
// 			<label htmlFor='start_time'>Start Time</label>
// 			<Flatpickr
// 				options={{
// 					altFormat: 'G:i K',
// 					mode: 'time',
// 					altInput: true,
// 				}}
// 				value={startTime || undefined}
// 				onChange={(dates) => {
// 					if (dates.length > 0) {
// 						setStartTime(dates[0]);
// 					}
// 				}}
// 				name='start_time'
// 				id='start_time'
// 				className='form-control'
// 				disabled={processing}
// 			/>
// 		</div>
// 		<div className='form-group col-12 col-md-6'>
// 			<label htmlFor='end_time'>End Time</label>
// 			<Flatpickr
// 				options={{
// 					altFormat: 'G:i K',
// 					mode: 'time',
// 					altInput: true,
// 					minTime: startTime || undefined,
// 				}}
// 				value={endTime || undefined}
// 				onChange={(dates) => {
// 					if (dates.length > 0) {
// 						setEndTime(dates[0]);
// 					}
// 				}}
// 				name='end_time'
// 				id='end_time'
// 				className='form-control'
// 				disabled={processing}
// 			/>
// 		</div>
// 		<div className='form-group col-12 col-md-4'>
// 			<label htmlFor='room_id'>Room</label>
// 			<select {...register('room_id')} name='room_id' id='room_id' className='form-control'>
// 				<option> -- Select -- </option>
// 				{rooms.map((room, index) => (
// 					<option value={room.id} key={index}>
// 						{room.code}
// 					</option>
// 				))}
// 			</select>
// 		</div>
// 		<div className='form-group col-12 col-md-4'>
// 			<label htmlFor='teacher_id'>Teacher</label>
// 			<select {...register('teacher_id')} name='teacher_id' id='teacher_id' className='form-control'>
// 				<option> -- Select -- </option>
// 				{teachers.map((teacher, index) => (
// 					<option value={teacher.id} key={index}>
// 						{teacher?.last_name}, {teacher.first_name} {teacher.middle_name}
// 					</option>
// 				))}
// 			</select>
// 		</div>
// 		<div className='form-group col-12 col-md-4'>
// 			<label htmlFor='subject_id'>Subject</label>
// 			<select {...register('subject_id')} name='subject_id' id='subject_id' className='form-control'>
// 				<option> -- Select -- </option>
// 				{subjects.map((subject, index) => (
// 					<option value={subject.id} key={index}>
// 						{subject.code}
// 					</option>
// 				))}
// 			</select>
// 		</div>
// 	</>
// );
