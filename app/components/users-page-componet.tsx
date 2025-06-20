'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { PasswordInput } from '@/components/ui/password-input';
import { toaster } from '@/components/ui/toaster';
import { formatPhoneNumber } from '@/config';
import { AuthService } from '@/services/login';
import { UsersService } from '@/services/users';
import {
	Button,
	ButtonGroup,
	Center,
	CloseButton,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Input,
	Pagination,
	Portal,
	Spinner,
	Stack,
	Table,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { LuChevronLeft, LuChevronRight, LuPlus, LuTrash2 } from 'react-icons/lu';

const UsersPagePomponet = () => {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		phone_number: '',
		password: '',
	});
	const pageSize = 5;
	const { colorMode } = useColorMode();
	const [open, setOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<any | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<any | null>(null);

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

	const openModal = (user: any | null = null) => {
		setSelectedUser(user);
		if (user) {
			setFormData({
				first_name: user.first_name,
				last_name: user.last_name,
				phone_number: user.phone_number,
				password: '',
			});
		} else {
			setFormData({
				first_name: '',
				last_name: '',
				phone_number: '',
				password: '',
			});
		}
		setOpen(true);
	};

	const closeModal = () => {
		setSelectedUser(null);
		setOpen(false);
	};

	const fetchData = async () => {
		if (!token) {
			toaster.error({
				title: 'Token mavjud emas, foydalanuvchilar ro‘yxatini yuklab bo‘lmaydi.',
				closable: true,
			});
			setLoading(false);
			return;
		}
		try {
			const data = await UsersService.getUsers();
			setItems(data);
		} catch (error) {
			console.error('Failed to load users');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [!token]);

	const handlePageChange = (page: number) => setCurrentPage(page);

	const handleSubmit = async () => {
		try {
			if (selectedUser) {
				await UsersService.updateUser({
					id: selectedUser.id,
					first_name: formData.first_name,
					last_name: formData.last_name,
					phone_number: formData.phone_number,
					password: formData.password,
				});
			} else {
				// CREATE
				await AuthService.register(formData);
			}
			closeModal();
			await fetchData();
		} catch (error) {
			console.error('Xatolik:', error);
		}
	};

	const backdropStyles = {
		backgroundColor: 'rgba(0,0,0,0.4)',
		backdropFilter: 'blur(6px)',
		WebkitBackdropFilter: 'blur(6px)',
		position: 'fixed',
		inset: 0,
		zIndex: 1002,
	};

	const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const backgroundColor = colorMode === 'dark' ? '#040711' : '#eaefef';

	if (loading) {
		return (
			<Center h='200px'>
				<Spinner size='lg' />
			</Center>
		);
	}

	return (
		<Stack width='full' gap='5'>
			<Flex justify='space-between' align='center'>
				<Heading size='xl'>Users</Heading>
				<Button colorScheme='blue' variant='solid' onClick={() => openModal(null)}>
					<LuPlus /> Add New User
				</Button>
			</Flex>

			<Table.Root
				size='lg'
				border='1px solid'
				borderColor={colorMode === 'dark' ? '#2d3748' : '#cbd5e0'}
			>
				<Table.Header>
					<Table.Row bg={colorMode === 'dark' ? '#040711' : '#FFEDF3'}>
						<Table.ColumnHeader>First Name</Table.ColumnHeader>
						<Table.ColumnHeader>Last Name</Table.ColumnHeader>
						<Table.ColumnHeader>Phone</Table.ColumnHeader>
						<Table.ColumnHeader textAlign='center'>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{paginatedItems.map(item => (
						<Table.Row key={item.id} bg={colorMode === 'dark' ? '#040711' : '#FFEDF3'}>
							<Table.Cell>{item.first_name}</Table.Cell>
							<Table.Cell>{item.last_name}</Table.Cell>
							<Table.Cell>{formatPhoneNumber(item.phone_number)}</Table.Cell>
							<Table.Cell textAlign='center'>
								<ButtonGroup size='sm' variant='ghost'>
									<IconButton aria-label='Edit' colorScheme='blue' onClick={() => openModal(item)}>
										<BiEdit />
									</IconButton>
									<IconButton
										aria-label='Delete'
										colorScheme='red'
										onClick={() => {
											setUserToDelete(item);
											setDeleteDialogOpen(true);
										}}
									>
										<LuTrash2 />
									</IconButton>
								</ButtonGroup>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			<Pagination.Root
				count={items.length}
				pageSize={pageSize}
				page={currentPage}
				onPageChange={details => handlePageChange(details.page)}
			>
				<ButtonGroup variant='ghost' size='sm' wrap='wrap'>
					<Pagination.PrevTrigger asChild>
						<IconButton aria-label='Previous page'>
							<LuChevronLeft />
						</IconButton>
					</Pagination.PrevTrigger>

					<Pagination.Items
						render={page => (
							<IconButton
								key={page.value}
								variant={page.value === currentPage ? 'outline' : 'ghost'}
								onClick={() => handlePageChange(page.value)}
							>
								{page.value}
							</IconButton>
						)}
					/>

					<Pagination.NextTrigger asChild>
						<IconButton aria-label='Next page'>
							<LuChevronRight />
						</IconButton>
					</Pagination.NextTrigger>
				</ButtonGroup>
			</Pagination.Root>

			{/* Dialog Modal */}
			<Dialog.Root open={open} placement='center'>
				<Portal>
					<Dialog.Backdrop style={backdropStyles as React.CSSProperties} />
					<Dialog.Positioner>
						<Dialog.Content bg={backgroundColor}>
							<Dialog.Header>
								<Dialog.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack>
									<Input
										placeholder='First Name'
										value={formData.first_name}
										onChange={e => setFormData({ ...formData, first_name: e.target.value })}
									/>
									<Input
										placeholder='Last Name'
										value={formData.last_name}
										onChange={e => setFormData({ ...formData, last_name: e.target.value })}
									/>
									<Input
										placeholder='Phone Number'
										value={formData.phone_number}
										onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
									/>
									<PasswordInput
										placeholder='Password'
										value={formData.password}
										onChange={e => setFormData({ ...formData, password: e.target.value })}
									/>
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button variant='outline' onClick={closeModal}>
										Cancel
									</Button>
								</Dialog.ActionTrigger>
								<Button colorScheme='blue' onClick={handleSubmit}>
									{selectedUser ? 'Update' : 'Create'}
								</Button>
							</Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<CloseButton size='sm' onClick={closeModal} />
							</Dialog.CloseTrigger>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>

			<Dialog.Root open={deleteDialogOpen} placement='center'>
				<Portal>
					<Dialog.Backdrop style={backdropStyles as React.CSSProperties} />
					<Dialog.Positioner>
						<Dialog.Content bg={backgroundColor}>
							<Dialog.Header>
								<Dialog.Title color='red.500'>Delete User</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								Are you sure you want to delete{' '}
								<strong>
									{userToDelete?.first_name} {userToDelete?.last_name}
								</strong>
								?
							</Dialog.Body>
							<Dialog.Footer gap={3}>
								<Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
									Cancel
								</Button>
								<Button
									colorScheme='red'
									onClick={async () => {
										if (userToDelete) {
											await UsersService.deleteUser(userToDelete.id);
											await fetchData();
											setDeleteDialogOpen(false);
										}
									}}
								>
									Delete
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</Stack>
	);
};

export default UsersPagePomponet;
