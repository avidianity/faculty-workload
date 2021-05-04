import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { EmploymentStatuses } from '../../constants';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { teacherService } from '../../services/teacher.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';

type Props = {};

type Inputs = {
	account_number: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	employment_status: string;
	availability_start: string;
	availability_end: string;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [availabilityStart, setAvailabilityStart] = useNullable<Date>();
	const [availabilityEnd, setAvailabilityEnd] = useNullable<Date>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: Inputs) => {
		setProcessing(true);
		try {
			if (availabilityStart) {
				payload.availability_start = dayjs(availabilityStart).format('HH:mm:ss');
			}

			if (availabilityEnd) {
				payload.availability_end = dayjs(availabilityEnd).format('HH:mm:ss');
			}

			await (mode === 'Add' ? teacherService.create(payload) : teacherService.update(id, payload));
			toastr.info('Teacher saved successfully.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchTeacher = async () => {
		try {
			const teacher = await teacherService.fetchOne(match.params.id);
			setID(teacher.id!);

			setValues(teacher, setValue);
			setAvailabilityStart(dayjs(teacher.availability_start, 'HH:mm:ss').toDate());
			setAvailabilityEnd(dayjs(teacher.availability_end, 'HH:mm:ss').toDate());
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchTeacher();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Teacher</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-3'>
							<label htmlFor='account_number'>Account Number</label>
							<input
								type='text'
								{...register('account_number')}
								name='account_number'
								id='account_number'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label htmlFor='first_name'>First Name</label>
							<input
								type='text'
								{...register('first_name')}
								name='first_name'
								id='first_name'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label htmlFor='middle_name'>Middle Name</label>
							<input
								type='text'
								{...register('middle_name')}
								name='middle_name'
								id='middle_name'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-3'>
							<label htmlFor='last_name'>Last Name</label>
							<input
								type='text'
								{...register('last_name')}
								name='last_name'
								id='last_name'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								{...register('email')}
								name='email'
								id='email'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='employment_status'>Employment Status</label>
							<select
								{...register('employment_status')}
								name='employment_status'
								id='employment_status'
								className='form-control'
								disabled={processing}>
								<option> -- Select -- </option>
								{EmploymentStatuses.map((status, index) => (
									<option value={status} key={index}>
										{status}
									</option>
								))}
							</select>
						</div>
						<div className='col-12'>
							<h5>Availability</h5>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='availability_start'>Start Time</label>
							<Flatpickr
								options={{
									altFormat: 'G:i K',
									mode: 'time',
									altInput: true,
								}}
								value={availabilityStart || ''}
								onChange={(dates) => {
									if (dates.length > 0) {
										setAvailabilityStart(dates[0]);
									}
								}}
								name='availability_start'
								id='availability_start'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='availability_end'>End Time</label>
							<Flatpickr
								options={{
									altFormat: 'G:i K',
									mode: 'time',
									minTime: availabilityStart || undefined,
									altInput: true,
								}}
								value={availabilityEnd || ''}
								onChange={(dates) => {
									if (dates.length > 0) {
										setAvailabilityEnd(dates[0]);
									}
								}}
								name='availability_end'
								id='availability_end'
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
				<div className='card-footer'>
					<p>Manual Here</p>
				</div>
			</div>
		</div>
	);
};

export default Form;
