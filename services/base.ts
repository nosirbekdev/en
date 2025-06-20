import { API_URL } from '@/config/api-config';
import { BaseInterface } from '@/interfaces/base.interface';
import axios from 'axios';

export const BaseService = {
	async appearance() {
		const response = await axios.get<BaseInterface[]>(`${API_URL}/base`);
		return response.data;
	},
};
