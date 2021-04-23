import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { v4 } from 'uuid';
import { SubjectContract } from '../../contracts/subject.contract';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { subjectService } from '../../services/subject.service';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<SubjectContract>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: SubjectContract) => {
		setProcessing(true);
		try {
			if (mode === 'Add') {
				payload.uuid = v4();
			}

			await (mode === 'Add' ? subjectService.create(payload) : subjectService.update(id, payload));
			toastr.info('Subject saved successfully.', 'Notice');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchSubject = async () => {
		try {
			const subject = await subjectService.fetchOne(match.params.id);
			setID(subject.id!);

			setValues(subject, setValue);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchSubject();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Subject</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='code'>Code</label>
							<input type='text' {...register('code')} name='code' id='code' className='form-control' disabled={processing} />
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='description'>Description</label>
							<input
								type='text'
								{...register('description')}
								name='description'
								id='description'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='units'>Units</label>
							<input
								type='number'
								{...register('units')}
								name='units'
								id='units'
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
