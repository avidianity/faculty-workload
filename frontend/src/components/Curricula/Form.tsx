import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { curriculumService } from '../../services/curriculum.service';
import Flatpickr from 'react-flatpickr';
import { CurriculumContract } from '../../contracts/curriculum.contract';

type Props = {};

type Inputs = {
	description: string;
	start_school_date: string;
	end_school_date: string;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const year = dayjs().year();

	const years: number[] = [];
	const [startSchoolDate, setStartSchoolDate] = useNullable<Date>();
	const [endSchoolDate, setEndSchoolDate] = useNullable<Date>();

	for (let x = year; x <= year + 7; x++) {
		years.push(x);
	}

	const submit = async (payload: CurriculumContract) => {
		setProcessing(true);
		try {
			payload.start_school_date = startSchoolDate?.toJSON() || '';
			payload.end_school_date = endSchoolDate?.toJSON() || '';
			await (mode === 'Add' ? curriculumService.create(payload) : curriculumService.update(id, payload));
			toastr.info('Curriculum saved successfully.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchCurriculum = async () => {
		try {
			const curriculum = await curriculumService.fetchOne(match.params.id);
			setID(curriculum.id!);

			setStartSchoolDate(dayjs(curriculum.start_school_date).toDate());
			setEndSchoolDate(dayjs(curriculum.end_school_date).toDate());
			setValues(curriculum, setValue);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchCurriculum();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Curriculum</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12'>
							<label htmlFor='description'>Description</label>
							<input {...register('description')} type='text' name='description' id='description' className='form-control' />
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='start_school_date'>Starting School Date</label>
							<Flatpickr
								options={{
									altInput: true,
								}}
								value={startSchoolDate || undefined}
								onChange={(dates) => {
									if (dates.length > 0) {
										setStartSchoolDate(dates[0]);
									}
								}}
								name='start_school_date'
								id='start_school_date'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='end_school_date'>Ending School Date</label>
							<Flatpickr
								options={{
									minDate: startSchoolDate || undefined,
									altInput: true,
								}}
								value={endSchoolDate || undefined}
								onChange={(dates) => {
									if (dates.length > 0) {
										setEndSchoolDate(dates[0]);
									}
								}}
								name='end_school_date'
								id='end_school_date'
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
