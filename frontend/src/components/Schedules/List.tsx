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
				refetch();
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
					employement_status: `${schedule.teacher?.employment_status}`,
					subject: schedule.subject?.code,
					room: schedule.room?.code,
					course_code: schedule.course?.code,
					course_description: schedule.course?.description,
					year_level: schedule.course?.year,
					section: schedule.course?.section,
					start_time: dayjs(schedule.start_time, 'HH:mm:ss').format('hh:mm A'),
					end_time: dayjs(schedule.end_time, 'HH:mm:ss').format('hh:mm A'),
					curriculum_year: `${schedule.subject?.curriculum?.start_year} - ${schedule.subject?.curriculum?.end_year}`,
					school_year: `${dayjs(schedule.subject?.curriculum?.start_school_date).format('YYYY')} - ${dayjs(
						schedule.subject?.curriculum?.end_school_date
					).format('YYYY')}`,
					days: schedule.days.join(', '),
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
					title: 'Subject',
					accessor: 'subject',
				},
				{
					title: 'Curriculum Year',
					accessor: 'curriculum_year',
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
					title: 'Start Time',
					accessor: 'start_time',
				},
				{
					title: 'End Time',
					accessor: 'end_time',
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
