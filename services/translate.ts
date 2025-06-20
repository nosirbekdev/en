import { API_URL, token } from '@/config/api-config';
import { UniversalType } from '@/interfaces/vocabulary.interface';
import axios from 'axios';

export const TranslateService = {
	async translateText({ text, text_lang }: UniversalType) {
		try {
			const response = await axios.post(
				`${API_URL}/translate`,
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
			console.error('Error in translateText:', error);
			throw error;
		}
	},
};
