'use client';

import { navLinks } from '@/config';
import { BaseInterface } from '@/interfaces/base.interface';
import { BaseService } from '@/services/base';
import {
	Avatar,
	Box,
	Button,
	ClientOnly,
	CloseButton,
	Drawer,
	Flex,
	HStack,
	Menu,
	Portal,
	Skeleton,
	Text,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdLogOut } from 'react-icons/io';
import { MdMenu } from 'react-icons/md';
import { ColorModeButton, useColorMode } from './ui/color-mode';

const Header = () => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { colorMode } = useColorMode();
	const [appearance, setAppearance] = useState<BaseInterface[]>([]);
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const fullName = decodeURIComponent(Cookies.get('full_name') || '');
	const isLoggedIn = Boolean(Cookies.get('access_token'));
	const manager = Cookies.get('role');
	const logout = () => {
		Cookies.remove('access_token');
		Cookies.remove('full_name');
		router.push('/login');
	};

	useEffect(() => {
		const accessToken = Cookies.get('access_token');
		if (!accessToken && pathname !== '/login') {
			router.push('/login');
		}
	}, [pathname, router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await BaseService.appearance();
				setAppearance(response);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	return (
		<ClientOnly fallback={<Skeleton height='64px' />}>
			<Box
				as='header'
				py={4}
				px={6}
				className={`border-t-4 ${
					colorMode === 'dark' ? ' bg-[#040711]' : 'border-blue-600 bg-[#eaefef]'
				} fixed top-0 left-0 right-0 z-50`}
			>
				<Flex justify={{ base: 'space-between', md: 'space-around' }} align='center'>
					{/* Logo Section */}
					{appearance.map(item => (
						<Link href='/' passHref key={item.id}>
							<Flex align='center' gap={2}>
								<Box className='text-blue-400 text-4xl mr-2'>
									<Image
										src={item.image}
										alt={item.name}
										width={45}
										height={45}
										className='rounded-full'
									/>
								</Box>
								<Text
									fontSize='xl'
									fontWeight='bold'
									className={colorMode === 'dark' ? 'text-white' : 'text-blue-500'}
								>
									{item.name}
								</Text>
							</Flex>
						</Link>
					))}

					{/* Desktop Navigation Links */}
					<HStack
						display={{ base: 'none', md: 'flex' }}
						px={4}
						py={2}
						className={`rounded-full border ${
							colorMode === 'dark' ? 'border-blue-400 bg-white/5' : 'border-blue-500 bg-gray-100/50'
						} backdrop-blur-md transition-all duration-300 space-x-4`}
					>
						{navLinks.map(link => {
							if (link.label === 'Login' && isLoggedIn) return null;
							return (
								<Text
									key={link.label}
									className={`$${
										pathname === link.path
											? 'text-blue-400 font-bold'
											: colorMode === 'dark'
											? 'text-white'
											: 'text-gray-700'
									} text-md hover:text-blue-400 cursor-pointer`}
									onClick={() => {
										router.push(link.path);
										setOpen(false);
									}}
								>
									{link.label}
								</Text>
							);
						})}

						<ColorModeButton />
						{isLoggedIn && (
							<Box>
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
												{manager === 'true' && (
													<Menu.Item
														cursor={'pointer'}
														value='dashboard'
														fontSize={'16px'}
														onClick={() => router.push('/instructor/users')}
													>
														Dashboard
													</Menu.Item>
												)}
												<Menu.Item value='new-txt' fontSize={'16px'} onClick={logout}>
													Chiqish <IoMdLogOut />
												</Menu.Item>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>
							</Box>
						)}
					</HStack>

					{/* Mobile Menu Button */}
					<Box display={{ base: 'block', md: 'none' }}>
						<Drawer.Root open={open} onOpenChange={e => setOpen(e.open)}>
							<Drawer.Trigger asChild>
								<Button
									variant='outline'
									className={`$${
										colorMode === 'dark'
											? 'border-blue-400 text-white'
											: 'border-gray-300 text-gray-700'
									}`}
								>
									<MdMenu />
								</Button>
							</Drawer.Trigger>

							<Portal>
								<Drawer.Backdrop />
								<Drawer.Positioner>
									<Drawer.Content
										className={
											colorMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
										}
									>
										<Drawer.Header>
											<Drawer.Title className={colorMode === 'dark' ? '#eaefef' : '#040711'}>
												AI
											</Drawer.Title>
										</Drawer.Header>
										<Drawer.Body>
											<Flex direction='column' gap={4}>
												{navLinks.map(link => {
													if (link.label === 'Login' && isLoggedIn) return null;
													return (
														<Text
															key={link.label}
															fontSize='lg'
															className={`$${
																pathname === link.path
																	? 'text-blue-400'
																	: colorMode === 'dark'
																	? 'text-white'
																	: 'text-gray-900'
															} hover:text-blue-400 cursor-pointer`}
															onClick={() => {
																router.push(link.path);
																setOpen(false);
															}}
														>
															{link.label}
														</Text>
													);
												})}
												{isLoggedIn && (
													<Text
														display={'flex'}
														alignItems={'center'}
														fontSize={'18px'}
														cursor={'pointer'}
														onClick={logout}
													>
														Chiqish <IoMdLogOut />
													</Text>
												)}
												<Flex align={'center'} justify={'flex-start'} gap={3}>
													<ColorModeButton />
													{isLoggedIn && (
														<Box>
															<Avatar.Root className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-400 text-white font-semibold'>
																<Avatar.Fallback name={fullName} />
															</Avatar.Root>
														</Box>
													)}
												</Flex>
											</Flex>
										</Drawer.Body>
										<Drawer.CloseTrigger asChild>
											<CloseButton
												size='sm'
												top={4}
												right={4}
												className={colorMode === 'dark' ? 'text-white' : 'text-gray-900'}
											/>
										</Drawer.CloseTrigger>
									</Drawer.Content>
								</Drawer.Positioner>
							</Portal>
						</Drawer.Root>
					</Box>
				</Flex>
			</Box>
		</ClientOnly>
	);
};

export default Header;
