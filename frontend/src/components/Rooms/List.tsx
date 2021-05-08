import axios from 'axios';
import download from 'downloadjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../contracts/user.contract';
import { Asker, handleError, outIf } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../libraries/State';
import { roomService } from '../../services/room.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('rooms', () => roomService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this room?')) {
				await roomService.delete(id);
				toastr.info('Room has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	return (
		<Table
			onRefresh={() => refetch()}
			title='Rooms'
			loading={loading}
			items={
				items?.map((room) => ({
					...room,
					actions: (
						<div className={`${outIf(user?.role !== 'Admin', 'd-none', 'd-flex')}`}>
							<Link to={url(`${room.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1 d-none'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(room.id);
								}}>
								<i className='fas fa-trash'></i>
							</button>
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
					title: 'Code',
					accessor: 'code',
				},
				{
					title: 'Actions',
					accessor: 'actions',
				},
			]}
			buttons={
				<>
					{user?.role === 'Admin' ? (
						<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2'>
							<i className='fas fa-plus'></i>
						</Link>
					) : null}
					<a
						className='btn btn-info btn-sm mx-2'
						href={`${process.env.REACT_APP_SERVER_URL}/exports/room`}
						onClick={async (e) => {
							e.preventDefault();
							const url = e.currentTarget.getAttribute('href');
							try {
								const { data, headers } = await axios.get<Blob>(url || '', { responseType: 'blob' });
								download(data, 'rooms.xlsx', headers['content-type']);
							} catch (error) {
								console.log(error.toJSON());
								toastr.error('Unable to export. Please try again later.');
							}
						}}>
						<i className='fas fa-file-export'></i>
					</a>
				</>
			}
		/>
	);
};

export default List;
