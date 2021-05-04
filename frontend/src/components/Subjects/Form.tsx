import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { v4 } from 'uuid';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { subjectService } from '../../services/subject.service';
import { SubjectContract } from '../../contracts/subject.contract';
import { useQuery } from 'react-query';
import { curriculumService } from '../../services/curriculum.service';
import { courseService } from '../../services/course.service';
import dayjs from 'dayjs';

type Props = {};

type Inputs = {
	uuid: string;
	prerequisites: string;
	code: string;
	description: string;
	units: number;
	lab_hours: string;
	lec_hours: string;
	semester: string;
	curriculum_id: number;
	year: string;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { data: curricula } = useQuery('curricula', () => curriculumService.fetch());
	const { data: coursesList } = useQuery('courses', () => courseService.fetch());
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (payload: SubjectContract) => {
		setProcessing(true);
		try {
			if (mode === 'Add') {
				payload.uuid = v4();
			}

			await (mode === 'Add' ? subjectService.create(payload) : subjectService.update(id, payload));
			toastr.info('Subject saved successfully.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchSubject = async () => {
		try {
			const subject = await subjectService.fetchOne(match.params.id);
			setID(subject.id!);

			setValues(subject, setValue);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetchSubject();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>{mode} Subject Offering</h4>
				</div>
				<div className='card-body'>
					<form className='form-row' onSubmit={handleSubmit(submit)}>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='curriculum_id'>Curricula</label>
							<select {...register('curriculum_id')} name='curriculum_id' id='curriculum_id' className='form-control'>
								<option> -- Select -- </option>
								{curricula?.map((curriculum, index) => (
									<option hidden={match !== undefined} value={curriculum.id} key={index}>
										{curriculum.description} | {dayjs(curriculum.start_school_date).format('MMMM DD, YYYY')} -{' '}
										{dayjs(curriculum.end_school_date).format('MMMM DD, YYYY')}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-6'>
							<label htmlFor='prerequisites'>Prerequisites</label>
							<input
								type='text'
								{...register('prerequisites')}
								name='prerequisites'
								id='prerequisites'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='code'>Code</label>
							<input type='text' {...register('code')} name='code' id='code' className='form-control' disabled={processing} />
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='description'>Description</label>
							<input
								type='text'
								{...register('description')}
								name='description'
								id='description'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='units'>Unit Credits</label>
							<input
								type='number'
								{...register('units')}
								name='units'
								id='units'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-6'>
							<label htmlFor='lab_hours'>Lab Hours</label>
							<input
								type='number'
								{...register('lab_hours')}
								name='lab_hours'
								id='lab_hours'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-6'>
							<label htmlFor='lec_hours'>Lec Hours</label>
							<input
								type='number'
								{...register('lec_hours')}
								name='lec_hours'
								id='lec_hours'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='semester'>Semester</label>
							<select {...register('semester')} name='semester' id='semester' className='form-control'>
								{['1st Semester', '2nd Semester', 'Summer'].map((semester, index) => (
									<option value={semester} key={index}>
										{semester}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='year'>Year Level</label>
							<select name='year' id='year' className='form-control'>
								{['1st', '2nd', '3rd', '4th', '5th'].map((year, index) => (
									<option value={year} key={index}>
										{year}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='course_id'>Course</label>
							<select name='course_id' id='course_id' className='form-control'>
								{coursesList?.map((course, index) => (
									<option value={course.id} key={index}>
										{course.description}
									</option>
								))}
							</select>
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
