import axios from 'axios';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { UserContract } from '../contracts/user.contract';
import { handleError } from '../helpers';
import { State } from '../libraries/State';
import { routes } from '../routes';

type Props = {};

const Login: FC<Props> = (props) => {
	const { register, handleSubmit } = useForm<UserContract>();
	const [processing, setProcessing] = useState(false);
	const history = useHistory();

	const state = State.getInstance();

	if (state.has('token') && state.has('user')) {
		history.push(routes.DASHBOARD);
	}

	const submit = async (payload: UserContract) => {
		setProcessing(true);
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: UserContract; token: string }>('/auth/login', payload);

			state.set('user', user).set('token', token);

			toastr.success(`Welcome back, ${user.name}.`);
			history.push(routes.DASHBOARD);
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div className='h-100vh d-flex align-items-center justify-content-center'>
			<div className='card shadow rounded' style={{ minWidth: '400px' }}>
				<div className='card-body'>
					<div className='d-flex justify-content-center'>
						<img src='/assets/images/logo.svg' alt='PUP Bansud' style={{ height: '100px', width: '100px' }} />
					</div>
					<form onSubmit={handleSubmit(submit)} className='mt-4'>
						<div className='form-group'>
							<label htmlFor='email'>Email</label>
							<input
								{...register('email')}
								type='email'
								name='email'
								id='email'
								placeholder='Email'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='password'>Password</label>
							<input
								{...register('password')}
								type='password'
								name='password'
								id='password'
								placeholder='Password'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group mt-4'>
							<button type='submit' className='btn btn-primary w-100' disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Login'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
