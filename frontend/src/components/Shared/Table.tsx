import React, { FC, useEffect } from 'react';
import { v4 } from 'uuid';
import { outIf } from '../../helpers';
import { useNullable } from '../../hooks';

type Props = {
	title: string;
	columns: { title: string; accessor: string }[];
	buttons?: any;
	casts?: { [key: string]: (value: any) => any };
	loading: boolean;
	onRefresh: () => void;
	items: any[];
};

const Table: FC<Props> = ({ columns, title, buttons, casts, loading, onRefresh, items }) => {
	const id = v4();
	const [datatable, setDatatable] = useNullable<DataTables.Api>();

	const cast = (key: string, value: any) => {
		if (casts && key in casts) {
			return casts[key](value);
		}

		return value;
	};

	useEffect(() => {
		const table = $(`#${id}`);

		if (datatable) {
			datatable.destroy();
		}

		setDatatable(table.DataTable());
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (items.length > 0) {
			$('.dataTables_empty').remove();
		}
	});

	return (
		<div className='container-fluid'>
			<div className='card shadow'>
				<div className='card-header d-flex align-items-center'>
					<h4 className='card-title'>{title}</h4>
					<button
						className='btn btn-info btn-sm ml-auto'
						disabled={loading}
						onClick={(e) => {
							e.preventDefault();
							onRefresh();
						}}>
						<i className={`fas fa-sync-alt ${outIf(loading, 'fa-spin')}`}></i>
					</button>
					{buttons}
				</div>
				<div className={`card-body table-responsive`}>
					<table id={id} className='table table-hover'>
						<thead>
							<tr>
								{columns.map((column, index) => (
									<th key={index}>{column.title}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									{columns.map(({ accessor }, index) => (
										<td key={index}>{cast(accessor, item[accessor])}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Table;
