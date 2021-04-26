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
			to: routes.COURSES,
			icon: 'pe-7s-rocket',
			title: 'Academic Programs',
		},
		{
			to: routes.CURRICULA,
			icon: 'pe-7s-light',
			title: 'Curricula',
		},
		{
			to: routes.ROOMS,
			icon: 'pe-7s-car',
			title: 'Rooms',
		},
		{
			to: routes.SCHEDULES,
			icon: 'pe-7s-display2',
			title: 'Schedules',
		},
		{
			to: routes.SUBJECTS,
			icon: 'pe-7s-display2',
			title: 'Subject Offerings',
		},
		{
			to: routes.TEACHERS,
			icon: 'pe-7s-mouse',
			title: 'Teachers',
		},
		{
			to: routes.USERS,
			icon: 'pe-7s-eyedropper',
			title: 'Users',
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
						{links.map(({ to, icon, title }, index) => (
							<li key={index}>
								<NavLink to={url(to)} activeClassName='mm-active'>
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
