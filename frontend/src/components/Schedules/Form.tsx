import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { handleError, outIf, setValues } from '../../helpers';
import { useArray, useMode, useNullable } from '../../hooks';
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
	const [days, setDays] = useArray<string>();
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

			payload.days = days;

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
			setSelected({
				...schedule,
			});
			setDays(schedule.days);
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
									} else {
										delete selected.subject;
										setSelected({ ...selected });
									}
								}}
								disabled={processing}>
								<option> -- Select -- </option>
								{subjects?.map((subject, index) => (
									<option value={subject.id} key={index}>
										{subject.description} - {subject.curriculum?.start_year}-{subject.curriculum?.end_year} | S.Y{' '}
										{dayjs(subject.curriculum?.start_school_date).format('YYYY')}-
										{dayjs(subject.curriculum?.end_school_date).format('YYYY')}
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
						<div className='form-group col-12 col-md-3'>
							<label htmlFor='course_id'>Course</label>
							<select
								{...register('course_id')}
								name='course_id'
								id='course_id'
								className='form-control'
								onChange={(e) => {
									const course = courses?.find((course) => course.id === e.target.value.toNumber());

									if (course) {
										setSelected({ ...selected, course });
									} else {
										delete selected.course;
										setSelected({ ...selected });
									}
								}}
								disabled={processing}>
								<option> -- Select -- </option>
								{courses?.map((course, index) => (
									<option value={course.id} key={index}>
										{course.code}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Course Description</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.course ? selected.course.description : ''}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Year Level</label>
							<input type='text' disabled className='form-control' value={selected.course ? selected.course.year : ''} />
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Section</label>
							<input type='text' disabled className='form-control' value={selected.course ? selected.course.section : ''} />
						</div>
						<div className='form-group col-12 col-md-4'>
							<h4>Semesters</h4>
							<div className='position-relative form-check'>
								<label className={`form-check-label ${outIf(selected.subject?.semester_1st === false, 'text-muted')}`}>
									<input
										{...register('semester')}
										name='semester'
										type='radio'
										className='form-check-input'
										value='1st Semester'
										disabled={processing || selected.subject?.semester_1st === false}
									/>
									1st Semester
								</label>
							</div>
							<div className='position-relative form-check'>
								<label className={`form-check-label ${outIf(selected.subject?.semester_2nd === false, 'text-muted')}`}>
									<input
										{...register('semester')}
										name='semester'
										type='radio'
										className='form-check-input'
										value='2nd Semester'
										disabled={processing || selected.subject?.semester_2nd === false}
									/>
									2nd Semester
								</label>
							</div>
							<div className='position-relative form-check'>
								<label className={`form-check-label ${outIf(selected.subject?.semester_summer === false, 'text-muted')}`}>
									<input
										{...register('semester')}
										name='semester'
										type='radio'
										className='form-check-input'
										value='Summer'
										disabled={processing || selected.subject?.semester_summer === false}
									/>
									Summer
								</label>
							</div>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='teacher_id'>Teacher</label>
							<select
								{...register('teacher_id')}
								name='teacher_id'
								id='teacher_id'
								className='form-control'
								onChange={(e) => {
									const teacher = teachers?.find((teacher) => teacher.id === e.target.value.toNumber());

									if (teacher) {
										setSelected({ ...selected, teacher });
									} else {
										delete selected.teacher;
										setSelected({ ...selected });
									}
								}}
								disabled={processing}>
								<option> -- Select -- </option>
								{teachers?.map((teacher, index) => (
									<option value={teacher.id} key={index}>
										{teacher.last_name}, {teacher.first_name} {teacher.middle_name}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label>Employment Status</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.teacher ? selected.teacher.employment_status : ''}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='room_id'>Room</label>
							<select {...register('room_id')} name='room_id' id='room_id' className='form-control' disabled={processing}>
								<option> -- Select -- </option>
								{rooms?.map((room, index) => (
									<option value={room.id} key={index}>
										{room.code}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='slot'>Slot</label>
							<input
								{...register('slot')}
								type='number'
								name='slot'
								id='slot'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label>Days</label>
							{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
								<div className='position-relative form-check' key={index}>
									<label className='form-check-label'>
										<input
											type='checkbox'
											className='form-check-input'
											checked={days.includes(day)}
											onChange={(e) => {
												if (days.includes(day)) {
													days.splice(days.indexOf(day), 1);
													setDays([...days]);
												} else {
													setDays([...days, day]);
												}
											}}
											disabled={processing}
										/>{' '}
										{day}
									</label>
								</div>
							))}
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='start_time'>Start Time</label>
							<Flatpickr
								options={{
									altFormat: 'G:i K',
									mode: 'time',
									altInput: true,
									minTime: selected.teacher ? dayjs(selected.teacher.availability_start, 'HH:mm:ss').toDate() : undefined,
									maxTime: selected.teacher ? dayjs(selected.teacher.availability_end, 'HH:mm:ss').toDate() : undefined,
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
									altFormat: 'G:i K',
									mode: 'time',
									altInput: true,
									minTime: startTime ? dayjs(startTime).add(1, 'hour').toDate() : undefined,
									maxTime: selected.teacher ? dayjs(selected.teacher.availability_end, 'HH:mm:ss').toDate() : undefined,
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
