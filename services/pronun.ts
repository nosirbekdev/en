import { API_URL, token } from '@/config/api-config';
import { PronunManagerType, PronunUserType } from '@/interfaces/pronun.interface';
import axios from 'axios';

export const PronunciationService = {
	async getPronunDef() {
		try {
			const response = await axios.get(`${API_URL}/pronundef/default/`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error fetching pronunciation definition:', error);
			throw error;
		}
	},

	async pronunCreateUser({ audio, text }: PronunUserType) {
		try {
			const formData = new FormData();
			formData.append('audio', audio);
			formData.append('text', text);

			const response = await axios.post(`${API_URL}/pronun`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error creating pronunciation user:', error);
			throw error;
		}
	},

	// managers

	async getPronunAllManager() {
		try {
			const response = await axios.get(`${API_URL}/pronundefall`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error fetching all pronunciation managers:', error);
			throw error;
		}
	},

	async getPronunCreateManager({ level, text }: PronunManagerType) {
		try {
			const response = await axios.post(
				`${API_URL}/pronundef`,
				{ level, text },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error creating pronunciation manager:', error);
			throw error;
		}
	},

	async getPronunUpdateManager(id: string, text?: string, level?: number) {
		try {
			const response = await axios.put(
				`${API_URL}/pronundef/${id}`,
				{ text, level },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error updating pronunciation manager:', error);
			throw error;
		}
	},

	async getPronunDeleteManager(id: string) {
		try {
			const response = await axios.delete(`${API_URL}/pronundef/${id}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error deleting pronunciation manager:', error);
			throw error;
		}
	},
};
