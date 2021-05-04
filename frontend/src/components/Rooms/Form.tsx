import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { v4 } from 'uuid';
import { RoomContract } from '../../contracts/room.contract';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { roomService } from '../../services/room.service';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, setValue } = useForm<RoomContract>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: RoomContract) => {
		setProcessing(true);
		try {
			if (mode === 'Add') {
				payload.uuid = v4();
			}

			await (mode === 'Add' ? roomService.create(payload) : roomService.update(id, payload));
			toastr.info('Room saved successfully.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchRoom = async () => {
		try {
			const room = await roomService.fetchOne(match.params.id);
			setID(room.id!);

			setValues(room, setValue);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchRoom();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Room</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12'>
							<label htmlFor='code'>Code</label>
							<input type='text' {...register('code')} name='code' id='code' className='form-control' disabled={processing} />
						</div>
						<div className='form-group col-12'>
							<button type='submit' className='btn btn-primary' disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Save'}
							</button>
						</div>
					</form>
				</div>
				<div className='card-footer'>
					<p>Manual Here</p>
				</div>
			</div>
		</div>
	);
};

export default Form;
