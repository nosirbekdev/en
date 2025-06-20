import Cookies from 'js-cookie';

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const token = Cookies.get('access_token');
