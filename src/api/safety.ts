import { api } from './client';

export async function getSafetyScores(params: {
	lat: number;
	lon: number;
	radius?: number;
}): Promise<[number, number, number][]> {
	return api.get<[number, number, number][]>('/safety-scores/heatmap', params);
}
