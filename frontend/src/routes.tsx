import { RouteProps } from 'react-router';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export const routes = {
	DASHBOARD: '/dashboard',
	LOGIN: '/',
	USERS: '/users',
	COURSES: '/courses',
	EMAILS: '/emails',
	ROOMS: '/rooms',
	SCHEDULES: '/schedules',
	SUBJECTS: '/subjects',
	TEACHERS: '/teachers',
};

export const views: RouteProps[] = [
	{
		path: routes.LOGIN,
		component: Login,
		exact: true,
	},
	{
		path: routes.DASHBOARD,
		component: Dashboard,
	},
];
