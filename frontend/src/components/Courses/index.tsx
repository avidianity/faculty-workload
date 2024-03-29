import React, { FC } from 'react';
import { Route, RouteProps, Switch } from 'react-router';
import { useURL } from '../../hooks';
import Form from './Form';
import List from './List';

type Props = {};

const Courses: FC<Props> = (props) => {
	const url = useURL();

	const routes: RouteProps[] = [
		{
			path: url('/'),
			component: List,
			exact: true,
		},
		{
			path: url('/add'),
			component: Form,
		},
		{
			path: url('/:id/edit'),
			component: Form,
		},
	];

	return (
		<Switch>
			{routes.map((route, index) => (
				<Route {...route} key={index} />
			))}
		</Switch>
	);
};

export default Courses;
