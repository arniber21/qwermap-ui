import { API_BASE_URL } from '@/lib/constants';
import type { ApiError } from '@/types/api';

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async get<T>(
		path: string,
		params?: Record<string, string | number | undefined>,
	): Promise<T> {
		const url = new URL(this.baseUrl + path);
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		const res = await fetch(url.toString());
		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			throw body as ApiError;
		}
		return res.json() as Promise<T>;
	}

	async post<T>(
		path: string,
		body?: unknown,
		headers?: Record<string, string>,
	): Promise<T> {
		const res = await fetch(this.baseUrl + path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});
		if (!res.ok) {
			const errBody = await res.json().catch(() => ({}));
			throw errBody as ApiError;
		}
		return res.json() as Promise<T>;
	}
}

export const api = new ApiClient(API_BASE_URL);
