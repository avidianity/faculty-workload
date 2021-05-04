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
import { subjectService } from '../../services/subject.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('subjects', () => subjectService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Subject Offering?')) {
				await subjectService.delete(id);
				toastr.info('Subject Offering has been deleted.', 'Notice');
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
			title='Subject Offerings'
			loading={loading}
			items={
				items?.map((subject) => ({
					...subject,
					actions: (
						<div className={`d-flex ${outIf(user?.role !== 'Admin', 'd-none')}`}>
							<Link to={url(`${subject.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1 d-none'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(subject.id);
								}}>
								<i className='fas fa-trash'></i>
							</button>
						</div>
					),
					curriculum: `${subject.curriculum?.description}`,
					school_year: `${dayjs(subject.curriculum?.start_school_date).format('YYYY')} - ${dayjs(
						subject.curriculum?.end_school_date
					).format('YYYY')}`,
					course: subject.course?.description,
				})) || []
			}
			columns={[
				{
					title: 'ID',
					accessor: 'id',
				},
				{
					title: 'Prerequisites',
					accessor: 'prerequisites',
				},
				{
					title: 'Code',
					accessor: 'code',
				},
				{
					title: 'Description',
					accessor: 'description',
				},
				{
					title: 'Unit Credits',
					accessor: 'units',
				},
				{
					title: 'Lab Hours',
					accessor: 'lab_hours',
				},
				{
					title: 'Lec Hours',
					accessor: 'lec_hours',
				},
				{
					title: 'Semester',
					accessor: 'semester',
				},
				{
					title: 'Year Level',
					accessor: 'year',
				},
				{
					title: 'Curriculum',
					accessor: 'curriculum',
				},
				{
					title: 'School Year',
					accessor: 'school_year',
				},
				{
					title: 'Course',
					accessor: 'course',
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
						href={`${process.env.REACT_APP_SERVER_URL}/exports/subject`}
						onClick={async (e) => {
							e.preventDefault();
							const url = e.currentTarget.getAttribute('href');
							try {
								const { data, headers } = await axios.get<Blob>(url || '', { responseType: 'blob' });
								download(data, 'subjects.xlsx', headers['content-type']);
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
