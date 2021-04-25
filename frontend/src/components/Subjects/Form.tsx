import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { v4 } from 'uuid';
import { CurriculumContract } from '../../contracts/curriculum.contract';
import { handleError, setValues } from '../../helpers';
import { useArray, useMode, useNullable } from '../../hooks';
import { subjectService } from '../../services/subject.service';
import { CourseContract } from '../../contracts/course.contract';
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
	semester_1st: boolean;
	semester_2nd: boolean;
	semester_summer: boolean;
	curriculum_id: number;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { data: curricula } = useQuery('curricula', () => curriculumService.fetch());
	const { data: coursesList } = useQuery('courses', () => courseService.fetch());
	const [curriculum, setCurriculum] = useNullable<CurriculumContract>();
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [mode, setMode] = useMode();
	const [id, setID] = useNullable<number>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();
	const [years, setYears] = useArray<string>();
	const [courses, setCourses] = useArray<CourseContract>();

	const submit = async (payload: SubjectContract) => {
		setProcessing(true);
		try {
			if (mode === 'Add') {
				payload.uuid = v4();
			}

			payload.courses = courses;
			payload.years = years;

			await (mode === 'Add' ? subjectService.create(payload) : subjectService.update(id, payload));
			toastr.info('Subject saved successfully.', 'Notice');
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
			setYears(subject.years);
			setCourses(subject.courses!);
			setCurriculum(subject.curriculum!);
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
							<select
								{...register('curriculum_id')}
								name='curriculum_id'
								id='curriculum_id'
								className='form-control'
								onChange={(e) => {
									const curriculum = curricula?.find((curriculum) => curriculum.id === e.target.value.toNumber());
									if (curriculum) {
										setCurriculum(curriculum);
									} else {
										setCurriculum(null);
									}
								}}>
								<option> -- Select -- </option>
								{curricula?.map((curriculum, index) => (
									<option value={curriculum.id} key={index}>
										{curriculum.start_year} - {curriculum.end_year}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label>School Year</label>
							<select className='form-control' disabled>
								{curriculum ? (
									<option>
										{dayjs(curriculum.start_school_date).format('MMMM DD, YYYY')} -{' '}
										{dayjs(curriculum.end_school_date).format('MMMM DD, YYYY')}
									</option>
								) : (
									<option> -- N/A -- </option>
								)}
							</select>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-3'>
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
						<div className='form-group col-12 col-md-6 col-lg-3'>
							<label htmlFor='code'>Code</label>
							<input type='text' {...register('code')} name='code' id='code' className='form-control' disabled={processing} />
						</div>
						<div className='form-group col-12 col-md-6 col-lg-3'>
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
						<div className='form-group col-12 col-md-6 col-lg-3'>
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
							<h4>Semesters</h4>
							<div className='position-relative form-check'>
								<label className='form-check-label'>
									<input
										type='checkbox'
										{...register('semester_1st')}
										name='semester_1st'
										className='form-check-input'
										disabled={processing}
									/>{' '}
									1st Semester
								</label>
							</div>
							<div className='position-relative form-check'>
								<label className='form-check-label'>
									<input
										type='checkbox'
										{...register('semester_2nd')}
										name='semester_2nd'
										className='form-check-input'
										disabled={processing}
									/>{' '}
									2nd Semester
								</label>
							</div>
							<div className='position-relative form-check'>
								<label className='form-check-label'>
									<input
										type='checkbox'
										{...register('semester_summer')}
										name='semester_summer'
										className='form-check-input'
										disabled={processing}
									/>{' '}
									Summer
								</label>
							</div>
						</div>
						<div className='form-group col-12 col-md-4'>
							<h4>Year Levels</h4>
							{['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map((year, index) => (
								<div className='position-relative form-check' key={index}>
									<label className='form-check-label'>
										<input
											type='checkbox'
											className='form-check-input'
											disabled={processing}
											checked={years.includes(year)}
											onChange={(e) => {
												if (years.includes(year)) {
													years.splice(years.indexOf(year), 1);
													setYears([...years]);
												} else {
													setYears([...years, year]);
												}
											}}
										/>{' '}
										{year}
									</label>
								</div>
							))}
						</div>
						<div className='form-group col-12 col-md-4'>
							<h4>Courses</h4>
							{coursesList?.map((course, index) => (
								<div className='position-relative form-check' key={index}>
									<label className='form-check-label'>
										<input
											type='checkbox'
											className='form-check-input'
											disabled={processing}
											checked={courses.find((c) => c.id === course.id) !== undefined}
											onChange={() => {
												if (courses.find((c) => c.id === course.id) !== undefined) {
													courses.splice(courses.indexOf(course), 1);
													setCourses([...courses]);
												} else {
													setCourses([...courses, course]);
												}
											}}
										/>{' '}
										{course.code}
									</label>
								</div>
							))}
						</div>
						<div className='form-group col-12'>
							<button type='submit' className='btn btn-primary' disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
