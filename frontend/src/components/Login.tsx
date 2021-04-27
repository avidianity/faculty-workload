import axios from 'axios';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
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

	const id = v4();

	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-light bg-white shadow py-3 px-5'>
				<Link className='navbar-brand' to={routes.LOGIN}>
					<img src='/assets/images/logo.svg' alt='PUP Bansud' style={{ height: '40px', width: '40px' }} />
				</Link>
				<button className='navbar-toggler' type='button' data-toggle='collapse' data-target={`#${id}`}>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id={`${id}`}>
					<ul className='navbar-nav mx-auto'>
						<li className='nav-item mx-2'>
							<a className='nav-link' href='https://www.pup.edu.ph'>
								PUP
							</a>
						</li>
						<li className='nav-item mx-2'>
							<a className='nav-link' href='https://www.pup.edu.ph/about/branchescampuses'>
								Branches
							</a>
						</li>
						<li className='nav-item mx-2'>
							<a href='https://www.pup.edu.ph/admission' className='nav-link'>
								Admission
							</a>
						</li>
						<li className='nav-item mx-2'>
							<a href='https://www.pup.edu.ph/downloads/employees' className='nav-link'>
								Downloads
							</a>
						</li>
						<li className='nav-item mx-2'>
							<a href='https://www.pup.edu.ph/about' className='nav-link'>
								About Us
							</a>
						</li>
						<li className='nav-item mx-2'>
							<a href='https://sis1.pup.edu.ph' className='nav-link'>
								SIS for Faculty
							</a>
						</li>
					</ul>
				</div>
			</nav>
			<div className='container d-flex align-items-center justify-content-center padding-lg-50px'>
				<div className='login-container d-flex align-items-center rounded shadow'>
					<div className='card border-0 shadow-none mx-auto' style={{ maxWidth: '400px' }}>
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
			</div>
		</>
	);
};

export default Login;
