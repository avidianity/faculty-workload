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
import { SubjectContract } from '../../contracts/subject.contract';
import { TeacherContract } from '../../contracts/teacher.contract';

type Props = {};

type Day = { day: string; start_time: string; end_time: string; checked: boolean };

type Inputs = {
	teacher_id: number;
	subject_id: number;
	room_id: number;
	semester: string;
	slot: number;
	section: number;
	days: Day[];
};

type Selected = {
	subject?: SubjectContract;
	teacher?: TeacherContract;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { data: rooms } = useQuery('rooms', () => roomService.fetch());
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const { data: teachers } = useQuery('teachers', () => teacherService.fetch());
	const [days, setDays] = useArray<Day>([
		{
			day: 'Monday',
			start_time: '',
			end_time: '',
			checked: false,
		},
		{
			day: 'Tuesday',
			start_time: '',
			end_time: '',
			checked: false,
		},
		{
			day: 'Wednesday',
			start_time: '',
			end_time: '',
			checked: false,
		},
		{
			day: 'Thursday',
			start_time: '',
			end_time: '',
			checked: false,
		},
		{
			day: 'Friday',
			start_time: '',
			end_time: '',
			checked: false,
		},
		{
			day: 'Saturday',
			start_time: '',
			end_time: '',
			checked: false,
		},
		{
			day: 'Sunday',
			start_time: '',
			end_time: '',
			checked: false,
		},
	]);
	const [selected, setSelected] = useState<Selected>({});
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: Inputs) => {
		setProcessing(true);
		try {
			payload.days = days.filter((day) => day.checked);

			await (mode === 'Add' ? scheduleService.create(payload) : scheduleService.update(id, payload));
			toastr.info('Schedule saved successfully.', 'Notice');
			history.goBack();
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
			setSelected({
				...schedule,
			});

			setDays([
				...days.map((day) => {
					const scheduleDay = schedule.days.find((scheduleDay) => scheduleDay.day === day.day);
					if (scheduleDay !== undefined) {
						day.checked = true;
						day.start_time = scheduleDay.start_time;
						day.end_time = scheduleDay.end_time;
					}
					return day;
				}),
			]);

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
		<div className='container pb-5'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Schedule</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-3'>
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
										{subject.description} | {subject.code} {subject.course?.code}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Curriculum Description</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.subject ? `${selected.subject?.curriculum?.description}` : ''}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
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
							<label>Course</label>
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
							<label>Course Description</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.subject ? selected.subject.course?.description : ''}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Course Code</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.subject ? selected.subject.course?.code : ''}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Year Level</label>
							<input type='text' disabled className='form-control' value={selected.subject ? selected.subject.year : ''} />
						</div>
						<div className='form-group col-12 col-md-3'>
							<label>Section</label>
							<input {...register('section')} type='number' name='section' className='form-control' />
						</div>
						<div className='form-group col-12 col-md-4'>
							<label>Semester</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.subject ? selected.subject?.semester : ''}
							/>
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
						<div className='form-group col-12 col-md-6'>
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
						<div className='form-group col-12 col-md-6'>
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
						<div className='form-group col-12'>
							<label>Days</label>
							<div className='container-fluid'>
								<div className='table-responsive'>
									<table className='table'>
										<thead>
											<tr>
												<th>Day</th>
												<th>Start Time</th>
												<th>End Time</th>
											</tr>
										</thead>
										<tbody>
											{days.map((day, index) => (
												<tr key={index}>
													<td>
														<div className='position-relative form-check'>
															<label
																className={`form-check-label ${outIf(
																	selected.teacher === undefined,
																	'text-muted'
																)}`}>
																<input
																	type='checkbox'
																	className='form-check-input'
																	checked={day.checked}
																	onChange={(e) => {
																		day.checked = !day.checked;

																		days.splice(index, 1, day);
																		setDays([...days]);
																	}}
																	disabled={processing || selected.teacher === undefined}
																/>{' '}
																{day.day}
															</label>
														</div>
													</td>
													<td>
														<input
															type='text'
															disabled
															className={`form-control ${outIf(day.checked, 'd-none')}`}
														/>
														{day.checked ? (
															<Flatpickr
																options={{
																	altFormat: 'G:i K',
																	mode: 'time',
																	altInput: true,
																	defaultDate: selected.teacher
																		? dayjs(selected.teacher.availability_start, 'HH:mm:ss').toDate()
																		: undefined,
																	minTime: selected.teacher
																		? dayjs(selected.teacher.availability_start, 'HH:mm:ss').toDate()
																		: undefined,
																	maxTime:
																		day.end_time.length > 0
																			? dayjs(day.end_time, 'HH:mm:ss').toDate()
																			: selected.teacher
																			? dayjs(selected.teacher.availability_end, 'HH:mm:ss').toDate()
																			: undefined,
																}}
																value={
																	day.start_time.length > 0
																		? dayjs(day.start_time, 'HH:mm:ss').toDate()
																		: undefined
																}
																onChange={(dates) => {
																	if (dates.length > 0) {
																		day.start_time = dayjs(dates[0]).format('HH:mm:ss');
																		days.splice(index, 1, day);
																		setDays([...days]);
																	}
																}}
																className={`form-control`}
																disabled={processing}
															/>
														) : null}
													</td>
													<td>
														<input
															type='text'
															disabled
															className={`form-control ${outIf(day.checked, 'd-none')}`}
														/>
														{day.checked ? (
															<Flatpickr
																options={{
																	altFormat: 'G:i K',
																	mode: 'time',
																	altInput: true,
																	defaultDate: selected.teacher
																		? dayjs(selected.teacher.availability_start, 'HH:mm:ss').toDate()
																		: undefined,
																	minTime:
																		day.start_time.length > 0
																			? dayjs(day.start_time, 'HH:mm:ss').toDate()
																			: undefined,
																	maxTime: selected.teacher
																		? dayjs(selected.teacher.availability_end, 'HH:mm:ss').toDate()
																		: undefined,
																}}
																value={
																	day.end_time.length > 0
																		? dayjs(day.end_time, 'HH:mm:ss').toDate()
																		: undefined
																}
																onChange={(dates) => {
																	if (
																		dates.length > 0 &&
																		dayjs(dates[0]).diff(dayjs(day.start_time, 'HH:mm:ss'), 'hours') <=
																			6
																	) {
																		console.log('valid');
																		day.end_time = dayjs(dates[0]).format('HH:mm:ss');
																		days.splice(index, 1, day);
																		setDays([...days]);
																	} else {
																		setDays([...days]);
																	}
																}}
																className={`form-control`}
																disabled={processing}
															/>
														) : null}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className='form-group col-12'>
							<button type='submit' className='btn btn-primary' disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Save'}
							</button>
						</div>
					</form>
				</div>
				<div className='card-footer'>
					<p>Manual Here</p>
				</div>
			</div>
		</div>
	);
};

export default Form;
