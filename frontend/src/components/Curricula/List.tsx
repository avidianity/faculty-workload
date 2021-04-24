import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Asker, handleError } from '../../helpers';
import { useURL } from '../../hooks';
import { curriculumService } from '../../services/curriculum.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('curriculums', () => curriculumService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this curriculum?')) {
				await curriculumService.delete(id);
				toastr.info('Curriculum has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<Table
			onRefresh={() => refetch()}
			title='Curricula'
			loading={loading}
			items={
				items?.map((curriculum) => ({
					...curriculum,
					start_school_date: dayjs(curriculum.start_school_date).format('MMMM DD, YYYY'),
					end_school_date: dayjs(curriculum.end_school_date).format('MMMM DD, YYYY'),
					actions: (
						<div className='d-flex'>
							<Link to={url(`${curriculum.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(curriculum.id);
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
					title: 'Start Year',
					accessor: 'start_year',
				},
				{
					title: 'End Year',
					accessor: 'end_year',
				},
				{
					title: 'Starting School Date',
					accessor: 'start_school_date',
				},
				{
					title: 'Ending School Date',
					accessor: 'end_school_date',
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
