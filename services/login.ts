import { API_URL } from '@/config/api-config';
import { LoginType, RegisterType } from '@/interfaces/auth.interface';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthService = {
	async login({ phone_number, password }: LoginType) {
		try {
			const response = await axios.post(`${API_URL}/login`, {
				phone_number,
				password,
			});

			const { access, refresh, user } = response.data;

			Cookies.set('access_token', access, { expires: 1 });
			Cookies.set('refresh_token', refresh, { expires: 7 });
			Cookies.set('full_name', `${user.first_name} ${user.last_name}`, { expires: 1, path: '/' });
			Cookies.set('role', user.is_manager, { expires: 1, path: '/' });

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error('Login xatosi:', error.response?.data || error.message);
			} else {
				console.error('Noma’lum xatolik:', error);
			}
			throw error;
		}
	},

	async register({ first_name, last_name, password, phone_number }: RegisterType) {
		try {
			const response = await axios.post(`${API_URL}/register`, {
				first_name,
				last_name,
				password,
				phone_number,
			});

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error('Login xatosi:', error.response?.data || error.message);
			} else {
				console.error('Noma’lum xatolik:', error);
			}
			throw error;
		}
	},
};
