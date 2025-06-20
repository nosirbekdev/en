'use client';

import { Avatar, Box, Button, Flex, IconButton, Menu, Portal, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoMdLogOut } from 'react-icons/io';
import { ColorModeButton, useColorMode } from './ui/color-mode';

interface DashboardHeaderProps {
	onToggle: () => void;
}

const DashboardHeader = ({ onToggle }: DashboardHeaderProps) => {
	const { colorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	const fullName = decodeURIComponent(Cookies.get('full_name') || '');
	const logout = () => {
		Cookies.remove('access_token');
		Cookies.remove('full_name');
		router.push('/login');
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Server bilan farq qilmasligi uchun placeholder background beriladi
		return (
			<Box
				as='header'
				w='full'
				h='11vh'
				bg='#040711'
				px={6}
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				boxShadow='sm'
				position='fixed'
				top={0}
				left={0}
				zIndex={100}
			/>
		);
	}

	return (
		<Box
			as='header'
			w='full'
			h='11vh'
			bg={colorMode === 'dark' ? '#040711' : '#eaefef'}
			px={6}
			display='flex'
			alignItems='center'
			justifyContent='space-between'
			boxShadow='sm'
			position='fixed'
			top={0}
			left={0}
			zIndex={1000}
		>
			<Flex alignItems='center' gap={4}>
				<IconButton
					as={BiMenuAltLeft}
					onClick={onToggle}
					w={6}
					h={6}
					cursor={'pointer'}
					bg={'transparent'}
					color={colorMode === 'dark' ? 'white' : 'black'}
				/>
				<Text fontSize='xl' fontWeight='bold'>
					Instructor Dashboard
				</Text>
			</Flex>
			<Box>
				<ColorModeButton />
				<Menu.Root>
					<Menu.Trigger asChild>
						<Button
							variant='plain'
							size='sm'
							p='0'
							m='0'
							border='none'
							bg='transparent'
							boxShadow='none'
							_hover={{ boxShadow: 'none' }}
							_focus={{ boxShadow: 'none', outline: 'none' }}
						>
							<Avatar.Root className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-400 text-white font-semibold'>
								<Avatar.Fallback name={fullName} />
							</Avatar.Root>
						</Button>
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								<Menu.Item value='home' fontSize={'16px'} onClick={() => router.push('/')}>
									Bosh sahifa
								</Menu.Item>
								<Menu.Item value='new-txt' fontSize={'16px'} onClick={logout}>
									Chiqish <IoMdLogOut />
								</Menu.Item>
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu.Root>
			</Box>
		</Box>
	);
};

export default DashboardHeader;
