import React, { FC } from 'react';

type Props = {};

const Header: FC<Props> = (props) => {
	return (
		<>
			<div className='app-header__logo'>
				<div className='header__pane ml-auto'>
					<div>
						<button type='button' className='hamburger close-sidebar-btn hamburger--elastic' data-classname='closed-sidebar'>
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
		</>
	);
};

export default Header;
