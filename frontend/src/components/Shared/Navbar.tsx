import axios from 'axios';
import React, { FC } from 'react';
import { Asker, outIf } from '../../helpers';
import { History } from 'history';
import { routes } from '../../routes';
import { State } from '../../libraries/State';

type Props = {
	toggleSidebar: () => void;
	history: History<unknown>;
	isActive: boolean;
};

const Navbar: FC<Props> = ({ toggleSidebar, history, isActive }) => {
	const state = State.getInstance();

	const logout = async () => {
		if (await Asker.notice('Are you sure you want to logout?')) {
			axios.post('/auth/login').catch((e) => e);
			state.remove('user').remove('token');
			toastr.info('Logged out successfully.', 'Notice');
			history.push(routes.LOGIN);
		}
	};

	return (
		<div className='app-header header-shadow'>
			<div className='app-header__logo'>
				<div className='logo-src'></div>
				<div className='header__pane ml-auto'>
					<div>
						<button
							type='button'
							className={`hamburger hamburger--elastic ${outIf(isActive, 'is-active')}`}
							onClick={(e) => {
								e.preventDefault();
								toggleSidebar();
							}}>
							<span className='hamburger-box'>
								<span className='hamburger-inner'></span>
							</span>
						</button>
					</div>
				</div>
			</div>
			<div className='app-header__mobile-menu'>
				<div>
					<button type='button' className='hamburger hamburger--elastic mobile-toggle-nav'>
						<span className='hamburger-box'>
							<span className='hamburger-inner'></span>
						</span>
					</button>
				</div>
			</div>
			<div className='app-header__menu'>
				<span>
					<button type='button' className='btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav'>
						<span className='btn-icon-wrapper'>
							<i className='fa fa-ellipsis-v fa-w-6'></i>
						</span>
					</button>
				</span>
			</div>
			<div className='app-header__content'>
				<div className='app-header-left d-none'>
					<div className='search-wrapper'>
						<div className='input-holder'>
							<input type='text' className='search-input' placeholder='Type to search' />
							<button className='search-icon'>
								<span></span>
							</button>
						</div>
						<button className='close'></button>
					</div>
				</div>
				<div className='app-header-right'>
					<div className='header-btn-lg pr-0'>
						<div className='widget-content p-0'>
							<div className='widget-content-wrapper'>
								<div className='widget-content-left'>
									<div className={`btn-group`}>
										<a
											href='/'
											className='p-0 btn'
											onClick={(e) => {
												e.preventDefault();
												logout();
											}}>
											<i className='fas fa-sign-out-alt fa-2x'></i>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
