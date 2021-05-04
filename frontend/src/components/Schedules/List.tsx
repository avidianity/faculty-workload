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
			title='Schedules'
			loading={loading}
			items={
				items?.map((schedule) => ({
					...schedule,
					teacher: `${schedule.teacher?.last_name}, ${schedule.teacher?.first_name} ${schedule.teacher?.middle_name || ''}`,
					employment_status: `${schedule.teacher?.employment_status}`,
					subject: schedule.subject?.code,
					room: schedule.room?.code,
					course_code: schedule.course?.code,
					course_description: schedule.course?.description,
					year_level: schedule.subject?.year,
					section: schedule.section,
					semester: schedule.subject?.semester,
					curriculum_description: `${schedule.subject?.curriculum?.description}`,
					school_year: `${dayjs(schedule.subject?.curriculum?.start_school_date).format('YYYY')} - ${dayjs(
						schedule.subject?.curriculum?.end_school_date
					).format('YYYY')}`,
					days: schedule.days.map((day) => day.day).join(', '),
					actions: (
						<div className={`d-flex ${outIf(user?.role !== 'Admin', 'd-none')}`}>
							<Link to={url(`${schedule.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1 d-none'
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
					title: 'Subject',
					accessor: 'subject',
				},
				{
					title: 'Curriculum Description',
					accessor: 'curriculum_description',
				},
				{
					title: 'School Year',
					accessor: 'school_year',
				},
				{
					title: 'Course',
					accessor: 'course_code',
				},
				{
					title: 'Course Description',
					accessor: 'course_description',
				},
				{
					title: 'Year Level',
					accessor: 'year_level',
				},
				{
					title: 'Section',
					accessor: 'section',
				},
				{
					title: 'Semester',
					accessor: 'semester',
				},
				{
					title: 'Teacher',
					accessor: 'teacher',
				},
				{
					title: 'Employment Status',
					accessor: 'employment_status',
				},
				{
					title: 'Room',
					accessor: 'room',
				},
				{
					title: 'Slot',
					accessor: 'slot',
				},
				{
					title: 'Days',
					accessor: 'days',
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
						href={`${process.env.REACT_APP_SERVER_URL}/exports/schedule`}
						onClick={async (e) => {
							e.preventDefault();
							const url = e.currentTarget.getAttribute('href');
							try {
								const { data, headers } = await axios.get<Blob>(url || '', { responseType: 'blob' });
								download(data, 'schedules.xlsx', headers['content-type']);
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
