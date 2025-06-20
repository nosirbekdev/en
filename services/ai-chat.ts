import { API_URL, token } from '@/config/api-config';
import { AIChatSettings } from '@/interfaces/ai-chat.interface';
import axios from 'axios';

export const AiChatService = {
	async settingsChat({ lang_code, language, level, voice }: AIChatSettings) {
		try {
			const response = await axios.put(
				`${API_URL}/settings`,
				{ lang_code, language, voice, level },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error('Error fetching settings:', error);
			throw error;
		}
	},

	async getSettings() {
		try {
			const response = await axios.get(`${API_URL}/settings`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error fetching settings:', error);
			throw error;
		}
	},
};
