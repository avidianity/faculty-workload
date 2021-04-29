import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../contracts/user.contract';
import { Asker, handleError } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../libraries/State';
import { userService } from '../../services/user.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this user?')) {
				await userService.delete(id);
				toastr.info('User has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const self = State.getInstance().get<UserContract>('user');

	return (
		<Table
			onRefresh={() => refetch()}
			title='Users'
			loading={loading}
			items={
				items?.map((user) => ({
					...user,
					name: (
						<>
							{user.name} {self.id === user.id ? <span className='badge badge-primary'>You</span> : null}
						</>
					),
					actions: (
						<div className='d-flex'>
							<Link to={url(`${user.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							{self.id !== user.id ? (
								<button
									className='btn btn-danger btn-sm mx-1 d-none'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(user.id);
									}}>
									<i className='fas fa-trash'></i>
								</button>
							) : null}
						</div>
					),
				})) || []
			}
			columns={[
				{
					title: 'ID',
					accessor: 'id',
				},
				{
					title: 'Name',
					accessor: 'name',
				},
				{
					title: 'Email',
					accessor: 'email',
				},
				{
					title: 'Role',
					accessor: 'role',
				},
				{
					title: 'Confirmed',
					accessor: 'confirmed',
				},
				{
					title: 'Blocked',
					accessor: 'blocked',
				},
				{
					title: 'Actions',
					accessor: 'actions',
				},
			]}
			casts={{
				confirmed: (value: boolean) => (value ? 'Yes' : 'No'),
				blocked: (value: boolean) => (value ? 'Yes' : 'No'),
			}}
			buttons={
				<>
					<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2'>
						<i className='fas fa-plus'></i>
					</Link>
					<a
						className='btn btn-info btn-sm mx-2'
						href={`${process.env.REACT_APP_SERVER_URL}/exports/user`}
						target='_blank'
						rel='noreferrer'>
						<i className='fas fa-file-export'></i>
					</a>
				</>
			}
		/>
	);
};

export default List;
