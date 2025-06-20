'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { PronunciationService } from '@/services/pronun';
import {
	Badge,
	Box,
	Button,
	ButtonGroup,
	Dialog,
	Flex,
	Grid,
	Heading,
	IconButton,
	NativeSelect,
	Spinner,
	Stack,
	Text,
	Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const levelColors: Record<number, string> = {
	1: 'green',
	2: 'orange',
	3: 'red',
};

const PronundefPageComponent = () => {
	const { colorMode } = useColorMode();
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const [isOpen, setIsOpen] = useState(false);
	const [editItem, setEditItem] = useState<any>(null);
	const [text, setText] = useState('');
	const [level, setLevel] = useState<number>(1);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<any>(null);

	const fetchAllManager = async () => {
		setLoading(true);
		try {
			const response = await PronunciationService.getPronunAllManager();
			setItems(response.reverse());
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllManager();
	}, []);

	const handleOpen = (item?: any) => {
		if (item) {
			setEditItem(item);
			setText(item.text);
			setLevel(item.level);
		} else {
			setEditItem(null);
			setText('');
			setLevel(1);
		}
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		setEditItem(null);
		setText('');
		setLevel(1);
	};

	const openDeleteDialog = (item: any) => {
		setItemToDelete(item);
		setIsDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setItemToDelete(null);
		setIsDeleteDialogOpen(false);
	};

	const backdropStyles = {
		backgroundColor: 'rgba(0,0,0,0.4)',
		backdropFilter: 'blur(6px)',
		WebkitBackdropFilter: 'blur(6px)',
		position: 'fixed',
		inset: 0,
		zIndex: 1002,
	};

	const handleSubmit = async () => {
		try {
			if (editItem) {
				await PronunciationService.getPronunUpdateManager(editItem.id, text, level);
				toaster.success({ title: 'Updated successfully', closable: true });
			} else {
				await PronunciationService.getPronunCreateManager({ text, level });
				toaster.success({ title: 'Added successfully', closable: true });
			}
			handleClose();
			await fetchAllManager();
		} catch (error) {
			toaster.error({ title: 'Error occurred' });
		}
	};

	const handleDeleteConfirm = async () => {
		if (!itemToDelete) return;
		try {
			await PronunciationService.getPronunDeleteManager(itemToDelete.id);
			toaster.info({ title: 'Deleted successfully', closable: true });
			await fetchAllManager();
		} catch (error) {
			toaster.error({ title: 'Error deleting item', closable: true });
		}
		closeDeleteDialog();
	};

	const backgroundColor = colorMode === 'dark' ? '#040711' : '#eaefef';

	if (loading)
		return (
			<Box py={20} textAlign='center'>
				<Spinner size='lg' />
			</Box>
		);

	return (
		<Box p={5}>
			<Flex justifyContent='space-between' alignItems='center' mb={5}>
				<Heading size='lg'>Pronunciation Practice Sentences</Heading>
				<Button
					color={colorMode === 'dark' ? 'black' : 'white'}
					bg={colorMode === 'dark' ? '#FFEDF3' : '#040711'}
					onClick={() => handleOpen()}
				>
					<LuPlus />
					&nbsp;Add New
				</Button>
			</Flex>

			<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
				{items.map(item => (
					<Box
						key={item.id}
						p={4}
						borderRadius='2xl'
						boxShadow='lg'
						border='1px solid'
						borderColor={colorMode === 'dark' ? '#2d3748' : '#cbd5e0'}
					>
						<Stack gap={3}>
							<Flex justifyContent='space-between' alignItems='center'>
								<Badge color='white' p={1} bg={levelColors[item.level]}>
									Level {item.level}
								</Badge>
								<ButtonGroup size='sm' variant='ghost'>
									<IconButton aria-label='Edit' colorScheme='blue' onClick={() => handleOpen(item)}>
										<BiEdit />
									</IconButton>
									<IconButton
										aria-label='Delete'
										colorScheme='red'
										onClick={() => openDeleteDialog(item)}
									>
										<LuTrash2 />
									</IconButton>
								</ButtonGroup>
							</Flex>
							<Text>{item.text}</Text>
						</Stack>
					</Box>
				))}
			</Grid>

			{/* Dialog */}
			<Dialog.Root open={isOpen} placement={'center'}>
				<Dialog.Backdrop style={backdropStyles as React.CSSProperties} />
				<Dialog.Positioner>
					<Dialog.Content bg={backgroundColor}>
						<Dialog.CloseTrigger />
						<Dialog.Header>
							<Dialog.Title>{editItem ? 'Edit Sentence' : 'Add New Sentence'}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Stack spaceY={4}>
								<Textarea
									placeholder='Enter sentence...'
									value={text}
									onChange={e => setText(e.target.value)}
									width='100%'
									minHeight='250px'
									resize='vertical'
									p={3}
									fontSize='md'
									borderColor={colorMode === 'dark' ? '#2d3748' : 'gray.400'}
								/>

								<NativeSelect.Root size='md' width='full'>
									<NativeSelect.Field
										placeholder='Select level'
										value={level.toString()}
										onChange={e => setLevel(parseInt(e.target.value))}
										borderColor={colorMode === 'dark' ? '#2d3748' : 'gray.400'}
									>
										<option value='1'>Level 1 (Beginner)</option>
										<option value='2'>Level 2 (Intermediate)</option>
										<option value='3'>Level 3 (Advanced)</option>
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</Stack>
						</Dialog.Body>
						<Dialog.Footer>
							<Button colorScheme='blue' onClick={handleSubmit}>
								Save
							</Button>
							<Button variant='outline' onClick={handleClose}>
								Cancel
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>

			<Dialog.Root open={isDeleteDialogOpen} placement='center'>
				<Dialog.Backdrop style={backdropStyles as React.CSSProperties} />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.CloseTrigger />
						<Dialog.Header>
							<Dialog.Title>Confirm Deletion</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text>Are you sure you want to delete this sentence?</Text>
							<Box mt={3} p={3} border='1px dashed' borderRadius='md' fontSize='sm'>
								{itemToDelete?.text}
							</Box>
						</Dialog.Body>
						<Dialog.Footer>
							<Button colorScheme='red' onClick={handleDeleteConfirm}>
								Delete
							</Button>
							<Button variant='ghost' onClick={closeDeleteDialog}>
								Cancel
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</Box>
	);
};

export default PronundefPageComponent;
