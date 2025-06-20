export interface LoginType {
	phone_number: string;
	password: string;
}

export interface RegisterType {
	first_name: string;
	last_name: string;
	phone_number: string;
	password?: string;
	id?: string;
}
