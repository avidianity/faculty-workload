import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Asker, handleError } from '../../helpers';
import { useURL } from '../../hooks';
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
			}
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<Table
			onRefresh={() => refetch()}
			title='Teachers'
			loading={loading}
			items={
				items?.map((teacher) => ({
					...teacher,
					name: `${teacher.last_name}, ${teacher.first_name} ${teacher.middle_name}`,
					actions: (
						<div className='d-flex'>
							<Link to={url(`${teacher.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1'
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
					title: 'Name',
					accessor: 'name',
				},
				{
					title: 'Email',
					accessor: 'email',
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
