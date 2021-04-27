import React, { FC, useEffect } from 'react';
import { NavbarBus } from '../events';

type Props = {};

const Analytics: FC<Props> = (props) => {
	useEffect(() => {
		NavbarBus.dispatch('toggle-search', true);

		return () => {
			NavbarBus.dispatch('toggle-search', false);
		};
	});

	return <div className='container'>haha</div>;
};

export default Analytics;
