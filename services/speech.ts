import { API_URL } from '@/config/api-config';
import { SpeechType } from '@/interfaces/speech.interface';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');

export const SpeechService = {
	async speech({ lang_text, text, type, audio }: SpeechType) {
		try {
			const response = await axios.post(
				`${API_URL}/speech`,
				{
					lang_text,
					text,
					type,
					audio,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					responseType: 'blob',
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error updating word:', error);
			throw new Error('Speech failed');
		}
	},
};
