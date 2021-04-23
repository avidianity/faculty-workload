import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Asker, handleError } from '../../helpers';
import { useURL } from '../../hooks';
import { courseService } from '../../services/course.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('courses', () => courseService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this course?')) {
				await courseService.delete(id);
				toastr.info('Course has been deleted.', 'Notice');
			}
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<Table
			onRefresh={() => refetch()}
			title='Courses'
			loading={loading}
			items={
				items?.map((course) => ({
					...course,
					actions: (
						<div className='d-flex'>
							<Link to={url(`${course.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(course.id);
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
					title: 'Name',
					accessor: 'name',
				},
				{
					title: 'Description',
					accessor: 'description',
				},
				{
					title: 'Year',
					accessor: 'year',
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
