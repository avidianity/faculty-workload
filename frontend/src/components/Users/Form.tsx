import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { UserContract } from '../../contracts/user.contract';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { userService } from '../../services/user.service';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<UserContract>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: UserContract) => {
		setProcessing(true);
		try {
			await (mode === 'Add' ? userService.create(payload) : userService.update(id, payload));
			toastr.info('User saved successfully.', 'Notice');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchUser = async () => {
		try {
			const user = await userService.fetchOne(match.params.id);
			setID(user.id!);

			setValues(user, setValue);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchUser();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} User</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='name'>Name</label>
							<input type='text' {...register('name')} name='name' id='name' className='form-control' disabled={processing} />
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
							<label htmlFor='password'>Password</label>
							<input
								type='password'
								{...register('password')}
								name='password'
								id='password'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12'>
							<div className='position-relative form-check'>
								<label className='form-check-label'>
									<input
										type='checkbox'
										{...register('confirmed')}
										name='confirmed'
										className='form-check-input'
										disabled={processing}
									/>{' '}
									Confirmed
								</label>
							</div>
						</div>
						<div className='form-group col-12'>
							<div className='position-relative form-check'>
								<label className='form-check-label'>
									<input
										type='checkbox'
										{...register('blocked')}
										name='blocked'
										className='form-check-input'
										disabled={processing}
									/>{' '}
									Blocked
								</label>
							</div>
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
