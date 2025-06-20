'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const InstructorPageComponent = () => {
	const router = useRouter();
	const token = Cookies.get('access_token');
	useEffect(() => {
		const managerRole = Cookies.get('role');

		if (!token) {
			router.push('/login');
			return;
		}

		if (managerRole !== 'true') {
			router.push('/');
		} else {
			router.push('/instructor/users');
		}
	}, [token, router]);
	return <></>;
};

export default InstructorPageComponent;
