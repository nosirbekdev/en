'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { PasswordInput } from '@/components/ui/password-input';
import { toaster } from '@/components/ui/toaster';
import { AuthService } from '@/services/login';
import { Box, Button, Container, Field, Flex, Heading, Input, VStack } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatPhoneNumber = (value: string): string => {
	// Agar foydalanuvchi +998 ni o‘chirishga urinsa, hech bo‘lmaganda shu qolsin
	if (!value.startsWith('+998')) {
		value = '+998';
	}

	// Faqat raqamlarni ajratamiz
	let digits = value.replace(/\D/g, '');

	// 998 ni olib tashlaymiz, chunki biz +998 ni qo‘shamiz quyida
	if (digits.startsWith('998')) {
		digits = digits.slice(3);
	}

	// Maksimal 9ta raqam (keyingi qismi)
	if (digits.length > 9) {
		digits = digits.slice(0, 9);
	}

	// Formatlash
	let formatted = '+998';

	if (digits.length > 0) {
		formatted += digits.slice(0, 2);
	}
	if (digits.length > 2) {
		formatted += '-' + digits.slice(2, 5);
	}
	if (digits.length > 5) {
		formatted += '-' + digits.slice(5, 7);
	}
	if (digits.length > 7) {
		formatted += '-' + digits.slice(7, 9);
	}

	return formatted;
};

const LoginPageComponent = () => {
	const [number, setNumber] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ number?: string; password?: string }>({});
	const { colorMode } = useColorMode();
	const [formError, setFormError] = useState('');
	const router = useRouter();

	useEffect(() => {
		const accessToken = Cookies.get('access_token');
		if (accessToken) {
			router.push('/');
		}
	}, []);

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setNumber(formatPhoneNumber(inputValue));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(''); // har safar submitda tozalaymiz

		const newErrors: typeof errors = {};

		if (!number || number.length < 16) {
			newErrors.number = 'Telefon raqam to‘liq kiritilishi kerak';
		}

		if (!password) {
			newErrors.password = 'Parol majburiy';
		} else if (password.length < 8) {
			newErrors.password = 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			try {
				const result = await AuthService.login({
					phone_number: number.replace(/-/g, ''),
					password,
				});
				console.log('Login muvaffaqiyatli', result);
				toaster.success({
					title: 'Login muvaffaqiyatli amalga oshirildi',
					duration: 3000,
					description: 'Siz muvaffaqiyatli tizimga kirdingiz',
				});
				router.push('/');
				setNumber('');
				setPassword('');
			} catch (error: any) {
				// axios xatolikni aniqlaymiz
				if (error.response?.data?.non_field_errors) {
					setFormError(error.response.data.non_field_errors[0]);
				} else {
					setFormError('Noma’lum xatolik yuz berdi');
				}
			}
		}
	};

	return (
		<Flex
			justify='center'
			align='center'
			minH='90vh'
			bg={colorMode === 'dark' ? '#040711' : '#eaefef'}
		>
			<Container maxW='md' py={16}>
				<Box
					bg={colorMode === 'dark' ? '#040711' : '#eaefef'}
					p={8}
					borderRadius='lg'
					boxShadow='md'
				>
					<VStack align='stretch' as='form' onSubmit={handleSubmit}>
						<Heading textAlign='center' size='lg'>
							Login to Your Account
						</Heading>

						<Field.Root invalid={!!errors.number}>
							<Field.Label>Telefon raqam</Field.Label>
							<Input
								placeholder='+99890-990-90-90'
								type='tel'
								value={number}
								onChange={handlePhoneChange}
								borderColor={colorMode === 'dark' ? '' : 'gray.400'}
							/>

							{errors.number && <Field.ErrorText>{errors.number}</Field.ErrorText>}
						</Field.Root>

						<Field.Root invalid={!!errors.password}>
							<Field.Label>Parol</Field.Label>

							<PasswordInput
								placeholder='Parolingizni kiriting'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								borderColor={colorMode === 'dark' ? '' : 'gray.400'}
							/>
							{errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
						</Field.Root>

						<Button colorScheme='teal' type='submit' mt={4}>
							Login
						</Button>
					</VStack>
				</Box>
			</Container>
		</Flex>
	);
};

export default LoginPageComponent;
