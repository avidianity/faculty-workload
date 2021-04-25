import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Asker, handleError } from '../../helpers';
import { useURL } from '../../hooks';
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

	return (
		<Table
			onRefresh={() => refetch()}
			title='Subject Offerings'
			loading={loading}
			items={
				items?.map((subject) => ({
					...subject,
					actions: (
						<div className='d-flex'>
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
					semesters: (() => {
						const semesters: string[] = [];

						if (subject.semester_1st) {
							semesters.push('1st');
						}

						if (subject.semester_2nd) {
							semesters.push('2nd');
						}

						if (subject.semester_summer) {
							semesters.push('Summer');
						}

						return semesters;
					})().join(', '),
					curriculum: `${subject.curriculum?.start_year} - ${subject?.curriculum?.end_year}`,
					school_year: `${dayjs(subject.curriculum?.start_school_date).format('YYYY')} - ${dayjs(
						subject.curriculum?.end_school_date
					).format('YYYY')}`,
					courses: subject.courses?.map((course) => course.code).join(', '),
					years: subject.years.join(', '),
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
					title: 'Semesters',
					accessor: 'semesters',
				},
				{
					title: 'Years Levels',
					accessor: 'years',
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
					title: 'Courses',
					accessor: 'courses',
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
