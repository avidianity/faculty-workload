import React, { createRef, FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContract } from '../../contracts/user.contract';
import { useURL } from '../../hooks';
import { State } from '../../libraries/State';
import { routes } from '../../routes';
import { userService } from '../../services/user.service';
import Header from './Sidebar/Header';

type Props = {};

type SidebarRoute = {
	to: string;
	icon: string;
	title: string;
	exact: boolean;
};

const Sidebar: FC<Props> = (props) => {
	const state = State.getInstance();
	const [user, setUser] = useState(state.get<UserContract>('user'));
	const ref = createRef<HTMLInputElement>();
	const reader = new FileReader();

	reader.onload = async (event) => {
		if (event.target?.result) {
			try {
				const saved = await userService.update(user?.id, { photo_url: String(event.target.result) });
				state.set('user', saved);
				setUser(saved);
				toastr.info('Profile picture changed.', 'Notice');
			} catch (error) {
				console.log(error.toJSON());
				toastr.error('Unable to change profile picture.');
			}
		}
	};

	const links: SidebarRoute[] = [
		{
			to: '/',
			icon: 'pe-7s-users',
			title: 'Dashboard',
			exact: true,
		},
		{
			to: routes.COURSES,
			icon: 'pe-7s-rocket',
			title: 'Academic Programs',
			exact: false,
		},
		{
			to: routes.CURRICULA,
			icon: 'pe-7s-light',
			title: 'Curricula',
			exact: false,
		},
		{
			to: routes.ROOMS,
			icon: 'pe-7s-car',
			title: 'Rooms',
			exact: false,
		},
		{
			to: routes.SCHEDULES,
			icon: 'pe-7s-display2',
			title: 'Schedules',
			exact: false,
		},
		{
			to: routes.SUBJECTS,
			icon: 'pe-7s-display2',
			title: 'Subject Offerings',
			exact: false,
		},
		{
			to: routes.TEACHERS,
			icon: 'pe-7s-mouse',
			title: 'Teachers',
			exact: false,
		},
		{
			to: routes.USERS,
			icon: 'pe-7s-eyedropper',
			title: 'Users',
			exact: false,
		},
	];

	const url = useURL();

	return (
		<div className='app-sidebar sidebar-shadow'>
			<Header />
			<div className='scrollbar-sidebar'>
				<div className='app-sidebar__inner'>
					<ul className='vertical-nav-menu pt-3'>
						<li className='d-flex justify-content-center align-items-center mb-3'>
							<img
								src={user?.photo_url || '//via.placeholder.com/200'}
								className='rounded-circle border shadow clickable profile-picture'
								alt='Profile'
								style={{ height: '100px', width: '100px' }}
								onClick={(e) => {
									e.preventDefault();
									ref.current?.click();
								}}
							/>
							<input
								type='file'
								ref={ref}
								className='d-none'
								onChange={(e) => {
									if (e.target.files && e.target.files.length > 0) {
										reader.readAsDataURL(e.target.files[0]);
									}
								}}
							/>
						</li>
						{links.map(({ to, icon, title, exact }, index) => (
							<li key={index}>
								<NavLink to={url(to)} activeClassName='mm-active' exact={exact}>
									<i className={`metismenu-icon  ${icon}`}></i>
									{title}
								</NavLink>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
