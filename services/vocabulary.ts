import { API_URL } from '@/config/api-config';
import { UniversalType, VocabularyUpdateType } from '@/interfaces/vocabulary.interface';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');

export const VocabularyService = {
	async addDictCreate({ text, text_lang }: UniversalType) {
		try {
			const response = await axios.post(
				`${API_URL}/dict`,
				{
					text,
					text_lang,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error translating word:', error);
			throw new Error('Translation failed');
		}
	},

	async getDictList() {
		try {
			const response = await axios.get(
				`${API_URL}/dict`,

				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error translating word:', error);
			throw new Error('Translation failed');
		}
	},

	async updateDict({ id, uz, en }: VocabularyUpdateType) {
		try {
			const response = await axios.put(
				`${API_URL}/dict`,
				{
					id,
					uz,
					en,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error updating word:', error);
			throw new Error('Update failed');
		}
	},

	async deleteDict(id: string) {
		try {
			const response = await axios.delete(`${API_URL}/dict`, {
				data: { id },
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error deleting word:', error);
			throw new Error('Deletion failed');
		}
	},
};
