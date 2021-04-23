import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useURL } from '../../hooks';
import { routes } from '../../routes';
import Header from './Sidebar/Header';

type Props = {};

type SidebarRoute = {
	to: string;
	icon: string;
	title: string;
};

const Sidebar: FC<Props> = (props) => {
	const links: SidebarRoute[] = [
		{
			to: routes.COURSES,
			icon: 'pe-7s-rocket',
			title: 'Courses',
		},
		{
			to: routes.EMAILS,
			icon: 'pe-7s-diamond',
			title: 'Emails',
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
			title: 'Subjects',
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
