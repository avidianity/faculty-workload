import React, { FC, useState } from 'react';
import { Route, RouteProps, Switch, useHistory } from 'react-router';
import { outIf } from '../helpers';
import { useURL } from '../hooks';
import { routes } from '../routes';
import Courses from './Courses';
import Curricula from './Curricula';
import Rooms from './Rooms';
import Schedules from './Schedules';
import Navbar from './Shared/Navbar';
import Sidebar from './Shared/Sidebar';
import Subjects from './Subjects';
import Teachers from './Teachers';
import Users from './Users';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	const [closeSidebar, setCloseSidebar] = useState(false);
	const history = useHistory();

	const url = useURL();

	const localRoutes: RouteProps[] = [
		{
			path: url(routes.USERS),
			component: Users,
		},
		{
			path: url(routes.TEACHERS),
			component: Teachers,
		},
		{
			path: url(routes.SUBJECTS),
			component: Subjects,
		},
		{
			path: url(routes.ROOMS),
			component: Rooms,
		},
		{
			path: url(routes.COURSES),
			component: Courses,
		},
		{
			path: url(routes.SCHEDULES),
			component: Schedules,
		},
		{
			path: url(routes.CURRICULA),
			component: Curricula,
		},
	];

	return (
		<div
			className={`app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header ${outIf(
				closeSidebar,
				'closed-sidebar'
			)}`}>
			<Navbar history={history} isActive={closeSidebar} toggleSidebar={() => setCloseSidebar(!closeSidebar)} />
			<div className='app-main h-100'>
				<Sidebar />
				<div className='app-main__outer'>
					<div className='app-main__inner'>
						<Switch>
							{localRoutes.map((route, index) => (
								<Route {...route} key={index} />
							))}
						</Switch>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
