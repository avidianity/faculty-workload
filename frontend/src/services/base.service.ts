import axios from 'axios';
import { FreeObject } from '../contracts/misc';

export abstract class BaseService<T> {
	protected url: string;

	constructor(url: string) {
		this.url = url;
	}

	async fetch(params?: FreeObject) {
		const { data } = await axios.get<T[]>(this.resolveURL(params));
		return data;
	}

	async fetchOne(id: any, params?: FreeObject) {
		const { data } = await axios.get<T>(`${this.resolveURL(params, id)}`);
		return data;
	}

	async create(payload: T, params?: FreeObject) {
		const { data } = await axios.post<T>(`${this.resolveURL(params)}`, payload);
		return data;
	}

	async update(id: any, payload: Partial<T>, params?: FreeObject) {
		const { data } = await axios.put<T>(`${this.resolveURL(params, id)}`, payload);
		return data;
	}

	async delete(id: any, params?: FreeObject) {
		await axios.delete(`${this.resolveURL(params, id)}`);
	}

	protected resolveURL(params?: FreeObject, fragment = '') {
		return `${this.url}${`${fragment}`.length > 0 ? `/${fragment}` : ''}${params ? `?${new URLSearchParams(params).toString()}` : ''}`;
	}
}
