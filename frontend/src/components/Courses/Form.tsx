import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { v4 } from 'uuid';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { courseService } from '../../services/course.service';

type Props = {};

type Inputs = {
	uuid: string;
	code: string;
	description: string;
	year: number;
	section: number;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: Inputs) => {
		setProcessing(true);
		try {
			if (mode === 'Add') {
				payload.uuid = v4();
			}

			await (mode === 'Add' ? courseService.create(payload) : courseService.update(id, payload));
			toastr.info('Academic Program saved successfully.', 'Notice');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchCourse = async () => {
		try {
			const course = await courseService.fetchOne(match.params.id);
			setID(course.id!);

			setValues(course, setValue);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchCourse();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Academic Program</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='code'>Program Code</label>
							<input
								type='text'
								{...register('code', {
									required: true,
									pattern: /[A-Z]{4} \d-\d/g,
								})}
								name='code'
								id='code'
								className='form-control'
								disabled={processing}
							/>
							<small className='form-text text-muted'>
								Ex.: <b>BSIT 4-1</b>
							</small>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='description'>Program Description</label>
							<input
								type='text'
								{...register('description')}
								name='description'
								id='description'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='year'>Year Level</label>
							<input
								type='number'
								{...register('year')}
								name='year'
								id='year'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='section'>Section</label>
							<input
								type='number'
								{...register('section')}
								name='section'
								id='section'
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
