import { API_URL, token } from '@/config/api-config';
import { RegisterType } from '@/interfaces/auth.interface';
import axios from 'axios';

export const UsersService = {
	async getUsers() {
		try {
			const response = await axios.get(`${API_URL}/users`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error fetching users:', error);
			throw error;
		}
	},

	async updateUser({ first_name, last_name, password, phone_number, id }: RegisterType) {
		try {
			const payload: any = {
				first_name,
				last_name,
				phone_number,
			};

			if (password && password.trim() !== '') {
				payload.password = password;
			}

			const response = await axios.put(`${API_URL}/users/${id}`, payload, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error fetching update users:', error);
			throw error;
		}
	},

	async deleteUser(id: string) {
		try {
			const response = await axios.delete(`${API_URL}/users/${id}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			console.error('Error deleting user:', error);
			throw error;
		}
	},
};
