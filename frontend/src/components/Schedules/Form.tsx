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

type Day = {
	day: string;
	start_time_am: string;
	end_time_am: string;
	start_time_pm: string;
	end_time_pm: string;
	checked: boolean;
};

type Inputs = {
	teacher_id: number;
	subject_id: number;
	room_id: number;
	semester: string;
	slot: number;
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
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
			checked: false,
		},
		{
			day: 'Tuesday',
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
			checked: false,
		},
		{
			day: 'Wednesday',
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
			checked: false,
		},
		{
			day: 'Thursday',
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
			checked: false,
		},
		{
			day: 'Friday',
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
			checked: false,
		},
		{
			day: 'Saturday',
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
			checked: false,
		},
		{
			day: 'Sunday',
			start_time_am: '',
			end_time_am: '',
			start_time_pm: '',
			end_time_pm: '',
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
						day.start_time_am = scheduleDay.start_time_am;
						day.end_time_am = scheduleDay.end_time_am;
						day.start_time_pm = scheduleDay.start_time_pm;
						day.end_time_pm = scheduleDay.end_time_pm;
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
						<div className='form-group col-12 col-md-6'>
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
								{subjects
									?.filter((subject) => subject.schedules && subject.schedules.length === 0)
									.map((subject, index) => (
										<option value={subject.id} key={index}>
											{subject.description} | {subject.code} {subject.course?.code} -{' '}
											{subject.curriculum?.description}
										</option>
									))}
							</select>
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
							<input
								type='text'
								name='section'
								disabled
								className='form-control'
								value={selected.subject ? selected.subject.section : ''}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label>Semester</label>
							<input
								type='text'
								disabled
								className='form-control'
								value={selected.subject ? selected.subject.semester : ''}
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
												<th></th>
												<th className='text-center' colSpan={2}>
													AM
												</th>
												<th className='text-center' colSpan={2}>
													PM
												</th>
											</tr>
											<tr>
												<th className='text-center'>Day</th>
												<th className='text-center'>Start Time</th>
												<th className='text-center'>End Time</th>
												<th className='text-center'>Start Time</th>
												<th className='text-center'>End Time</th>
											</tr>
										</thead>
										<tbody>
											{days.map((day, index) => (
												<tr key={index}>
													<td>
														<div className='position-relative form-check'>
															<label
																className={`form-check-label ${outIf(
																	selected.teacher === undefined ||
																		!selected.teacher.days.includes(day.day),
																	'text-muted'
																)}`}>
																<input
																	type='checkbox'
																	className='form-check-input'
																	checked={day.checked}
																	onChange={(e) => {
																		if (selected.teacher && selected.teacher.days.includes(day.day)) {
																			day.checked = !day.checked;

																			days.splice(index, 1, day);
																			setDays([...days]);
																		}
																	}}
																	disabled={
																		processing ||
																		selected.teacher === undefined ||
																		!selected.teacher.days.includes(day.day)
																	}
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
																value={
																	day.start_time_am.length > 0
																		? dayjs(day.start_time_am, 'HH:mm:ss').toDate()
																		: undefined
																}
																options={{
																	altFormat: 'G:i K',
																	mode: 'time',
																	altInput: true,
																	minTime: dayjs('00:00:00', 'HH:mm:ss').toDate(),
																	maxTime: dayjs('12:00:00', 'HH:mm:ss').toDate(),
																}}
																className={`form-control`}
																disabled={processing}
																onChange={(dates) => {
																	if (dates.length > 0) {
																		day.start_time_am = dayjs(dates[0]).format('HH:mm:ss');
																		days.splice(index, 1, day);
																		setDays([...days]);
																	}
																}}
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
																value={
																	day.end_time_am.length > 0
																		? dayjs(day.end_time_am, 'HH:mm:ss').toDate()
																		: undefined
																}
																options={{
																	altFormat: 'G:i K',
																	mode: 'time',
																	altInput: true,
																	minTime:
																		day.start_time_am.length > 0
																			? dayjs(day.start_time_am, 'HH:mm:ss').toDate()
																			: dayjs('00:00:00', 'HH:mm:ss').toDate(),
																	maxTime: dayjs('12:00:00', 'HH:mm:ss').toDate(),
																}}
																className={`form-control`}
																disabled={processing}
																onChange={(dates) => {
																	if (dates.length > 0) {
																		day.end_time_am = dayjs(dates[0]).format('HH:mm:ss');
																		days.splice(index, 1, day);
																		setDays([...days]);
																	}
																}}
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
																value={
																	day.start_time_am.length > 0
																		? dayjs(day.start_time_pm, 'HH:mm:ss').toDate()
																		: undefined
																}
																options={{
																	altFormat: 'G:i K',
																	mode: 'time',
																	altInput: true,
																	minTime: dayjs('12:00:00', 'HH:mm:ss').toDate(),
																	maxTime: dayjs('24:00:00', 'HH:mm:ss').toDate(),
																}}
																className={`form-control`}
																disabled={processing}
																onChange={(dates) => {
																	if (dates.length > 0) {
																		day.start_time_pm = dayjs(dates[0]).format('HH:mm:ss');
																		days.splice(index, 1, day);
																		setDays([...days]);
																	}
																}}
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
																value={
																	day.end_time_am.length > 0
																		? dayjs(day.end_time_pm, 'HH:mm:ss').toDate()
																		: undefined
																}
																options={{
																	altFormat: 'G:i K',
																	mode: 'time',
																	altInput: true,
																	minTime:
																		day.start_time_am.length > 0
																			? dayjs(day.start_time_pm, 'HH:mm:ss').toDate()
																			: dayjs('12:00:00', 'HH:mm:ss').toDate(),
																	maxTime: dayjs('24:00:00', 'HH:mm:ss').toDate(),
																}}
																className={`form-control`}
																disabled={processing}
																onChange={(dates) => {
																	if (dates.length > 0) {
																		day.end_time_pm = dayjs(dates[0]).format('HH:mm:ss');
																		days.splice(index, 1, day);
																		setDays([...days]);
																	}
																}}
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
