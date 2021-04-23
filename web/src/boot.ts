import toastr from 'toastr';
import axios from 'axios';
import './shims';
import { State } from './libraries/State';
import $ from 'jquery';
import 'datatables.net';
import 'flatpickr/dist/themes/material_blue.css';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(CustomParseFormat);

window.$ = $;
window.toastr = toastr;

const url = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';

axios.defaults.baseURL = `${url}/api`;

axios.defaults.headers.common['Accept'] = 'application/json';

const state = State.getInstance();

if (state.has('token')) {
	const token = state.get('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});

axios.get(`${url}/sanctum/csrf-cookie`).catch(console.log);
