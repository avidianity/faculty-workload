import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Asker, handleError } from '../../helpers';
import { useURL } from '../../hooks';
import { scheduleService } from '../../services/schedule.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('schedules', () => scheduleService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this schedule?')) {
				await scheduleService.delete(id);
				toastr.info('Schedule has been deleted.', 'Notice');
			}
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<Table
			onRefresh={() => refetch()}
			title='Schedules'
			loading={loading}
			items={
				items?.map((schedule) => ({
					...schedule,
					teacher: `${schedule.teacher?.last_name}, ${schedule.teacher?.first_name} ${schedule.teacher?.middle_name}`,
					subject: schedule.subject?.code,
					room: schedule.room?.name,
					start_time: dayjs(schedule.start_time, 'HH:mm:ss').format('hh:mm A'),
					end_time: dayjs(schedule.end_time, 'HH:mm:ss').format('hh:mm A'),
					actions: (
						<div className='d-flex'>
							<Link to={url(`${schedule.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(schedule.id);
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
					title: 'Start Time',
					accessor: 'start_time',
				},
				{
					title: 'End Time',
					accessor: 'end_time',
				},
				{
					title: 'Teacher',
					accessor: 'teacher',
				},
				{
					title: 'Subject',
					accessor: 'subject',
				},
				{
					title: 'Room',
					accessor: 'room',
				},
				{
					title: 'Actions',
					accessor: 'actions',
				},
			]}
			buttons={
				<>
					<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2'>
						<i className='fas fa-plus'></i>
					</Link>
				</>
			}
		/>
	);
};

export default List;
