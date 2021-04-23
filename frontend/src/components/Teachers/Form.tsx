import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { TeacherContract } from '../../contracts/teacher.contract';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { teacherService } from '../../services/teacher.service';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<TeacherContract>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: TeacherContract) => {
		setProcessing(true);
		try {
			await (mode === 'Add' ? teacherService.create(payload) : teacherService.update(id, payload));
			toastr.info('Teacher saved successfully.', 'Notice');
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
						<div className='form-group col-12 col-md-6'>
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
						<div className='form-group col-12 col-md-6'>
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
						<div className='form-group col-12 col-md-6'>
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
