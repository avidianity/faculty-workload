import axios from 'axios';
import dayjs from 'dayjs';
import download from 'downloadjs';
import React, { FC, useEffect } from 'react';
import { TeacherContract } from '../contracts/teacher.contract';
import { NavbarBus } from '../events';
import { handleError } from '../helpers';
import { useNullable } from '../hooks';

type Props = {};

const Analytics: FC<Props> = (props) => {
	const [teacher, setTeacher] = useNullable<TeacherContract>();

	const searchTeacher = async (keyword: string) => {
		try {
			const { data } = await axios.get<TeacherContract[]>(`/teachers/search?query=${encodeURIComponent(keyword.toLowerCase())}`);
			setTeacher(data[0]);
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		NavbarBus.dispatch('toggle-search', true);

		const key = NavbarBus.listen<string>('search', (keyword) => searchTeacher(keyword));

		return () => {
			NavbarBus.dispatch('toggle-search', false);
			NavbarBus.unlisten(key);
		};
	});

	return (
		<div className='container pt-5'>
			<div className='card shadow'>
				<div className='card-header'>
					<h4 className='card-title align-self-center mt-1'>
						{teacher ? (
							<>
								{teacher?.last_name}, {teacher?.first_name} {teacher?.middle_name || ''} ({teacher?.account_number})
							</>
						) : null}
					</h4>
					{teacher ? (
						<a
							className='btn btn-info btn-sm ml-auto align-self-center'
							href={`teachers/export/${teacher.id}`}
							onClick={async (e) => {
								e.preventDefault();
								const url = e.currentTarget.getAttribute('href');
								try {
									const { data, headers } = await axios.get<Blob>(url || '', { responseType: 'blob' });
									download(data, `${teacher.last_name}, ${teacher.first_name}.xlsx`, headers['content-type']);
								} catch (error) {
									console.log(error.toJSON());
									toastr.error('Unable to export. Please try again later.');
								}
							}}>
							<i className='fas fa-file-export'></i>
						</a>
					) : null}
				</div>
				<div className='card-body table-responsive'>
					<table className='table table-sm table-bordered'>
						<thead>
							<tr>
								<th className='text-center'>ID</th>
								<th className='text-center'>Subject Code</th>
								<th className='text-center'>Description</th>
								<th className='text-center'>Lec</th>
								<th className='text-center'>Lab</th>
								<th className='text-center'>Units</th>
								<th className='text-center'>Schedule</th>
							</tr>
						</thead>
						<tbody>
							{teacher?.schedules?.map((schedule, index) => (
								<tr key={index}>
									<td className='text-center'>{schedule.id}</td>
									<td className='text-center'>{schedule.subject?.code}</td>
									<td className='text-center'>{schedule.subject?.description}</td>
									<td className='text-center'>{schedule.subject?.lec_hours}</td>
									<td className='text-center'>{schedule.subject?.lab_hours}</td>
									<td className='text-center'>{schedule.subject?.units}</td>
									<td className='text-center'>
										{schedule.days.map((day) => (
											<div>{`${day.day} | ${dayjs(day.start_time, 'HH:mm:ss').format('hh:mm A')} - ${dayjs(
												day.end_time,
												'HH:mm:ss'
											).format('hh:mm A')}`}</div>
										))}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
