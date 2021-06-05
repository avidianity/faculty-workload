import axios from 'axios';
import dayjs from 'dayjs';
import download from 'downloadjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../contracts/user.contract';
import { Asker, handleError, outIf } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../libraries/State';
import { teacherService } from '../../services/teacher.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('teachers', () => teacherService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this teacher?')) {
				await teacherService.delete(id);
				toastr.info('Teacher has been deleted.', 'Notice');
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
			title='Teachers'
			loading={loading}
			items={
				items?.map((teacher) => ({
					...teacher,
					name: `${teacher.last_name}, ${teacher.first_name} ${teacher.middle_name || ''}`,
					availability: (
						<div>
							{teacher.start_time_am && teacher.end_time_am
								? `${dayjs(teacher.start_time_am, 'HH:mm:ss').format('hh:mm A')}AM - ${dayjs(
										teacher.end_time_am,
										'HH:mm:ss'
								  ).format('hh:mm A')}AM`
								: null}
							<br />
							{teacher.start_time_pm && teacher.end_time_pm
								? `${dayjs(teacher.start_time_pm, 'HH:mm:ss').format('hh:mm')}PM - ${dayjs(
										teacher.end_time_pm,
										'HH:mm:ss'
								  ).format('hh:mm')}PM`
								: null}
						</div>
					),
					days: teacher.days.map((day, index) => (
						<span className='d-block' key={index}>
							{day}
						</span>
					)),
					actions: (
						<div className={`${outIf(user?.role !== 'Admin', 'd-none', 'd-flex')}`}>
							<Link to={url(`${teacher.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1 d-none'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(teacher.id);
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
					title: 'Account No.',
					accessor: 'account_number',
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
					title: 'Employment Status',
					accessor: 'employment_status',
				},
				{
					title: 'Days',
					accessor: 'days',
				},
				{
					title: 'Availability',
					accessor: 'availability',
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
						href={`${process.env.REACT_APP_SERVER_URL}/exports/teacher`}
						onClick={async (e) => {
							e.preventDefault();
							const url = e.currentTarget.getAttribute('href');
							try {
								const { data, headers } = await axios.get<Blob>(url || '', { responseType: 'blob' });
								download(data, 'teachers.xlsx', headers['content-type']);
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
