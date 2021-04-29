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
import logo from '../assets/images/logo.svg';

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
					<img src={logo} alt='PUP Bansud' style={{ height: '40px', width: '40px' }} />
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
			<div className='container d-flex align-items-center justify-content-center padding-lg-50px' style={{ marginBottom: '100px' }}>
				<div className='login-container d-flex align-items-center rounded shadow'>
					<div className='card border-0 shadow-none mx-auto' style={{ maxWidth: '400px' }}>
						<div className='card-body'>
							<div className='d-flex justify-content-center'>
								<img src={logo} alt='PUP Bansud' style={{ height: '100px', width: '100px' }} />
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
			<footer className='footer' style={{ backgroundColor: '#2b2b2b', padding: '50px 20px' }}>
				<div className='container'>
					<div className='row'>
						<div className='col-12 col-md-6 col-lg-3'>
							<p style={{ color: 'hsla(0,0%,100%,.30196078431372547)' }}>SERVICES</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>PUP WebMail</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>PUP iApply</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>SIS for Students</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>SIS for Faculty</p>
						</div>
						<div className='col-12 col-md-6 col-lg-3'>
							<p style={{ color: 'hsla(0,0%,100%,.30196078431372547)' }}>Quick Links</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>About Us</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Terms and Policies</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Terms of Use</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Privacy Statement</p>
						</div>
						<div className='col-12 col-md-6 col-lg-3'>
							<p style={{ color: 'hsla(0,0%,100%,.30196078431372547)' }}>Quick Links</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Admission Information</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Branches and Campuses</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Academic Programs</p>
							<p style={{ cursor: 'pointer', color: '#fff' }}>Jobs for PUPlans</p>
						</div>
						<div className='col-12 col-md-6 col-lg-3 d-flex justify-content-center' style={{ flexDirection: 'column' }}>
							<div className='d-flex'>
								<button className='mr-1 ml-auto btn btn-secondary btn-sm d-flex align-items-center justify-content-center rounded-circle p-1'>
									<i className='fab fa-facebook fa-2x'></i>
								</button>
								<button className='mx-1 btn btn-secondary btn-sm d-flex align-items-center justify-content-center rounded-circle p-1'>
									<i className='fab fa-twitter fa-2x'></i>
								</button>
								<button className='mx-1 btn btn-secondary btn-sm d-flex align-items-center justify-content-center rounded-circle p-1'>
									<i className='fab fa-linkedin fa-2x'></i>
								</button>
								<button className='ml-1 mr-auto btn btn-secondary btn-sm d-flex align-items-center justify-content-center rounded-circle p-1'>
									<i className='fab fa-instagram fa-2x'></i>
								</button>
							</div>
							<p className='text-white text-center'>©1998-2021 Polytechnic University of the Philippines.</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Login;
