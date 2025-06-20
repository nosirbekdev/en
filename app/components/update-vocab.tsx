'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { VocabularyService } from '@/services/vocabulary';
import {
	Button,
	CloseButton,
	Dialog,
	DialogBackdrop,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPositioner,
	DialogTitle,
	Input,
	Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type UpdateDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	item: { id: string; uz: string; en: string };
	onUpdated: () => void;
};

export const UpdateDialog = ({ isOpen, onClose, item, onUpdated }: UpdateDialogProps) => {
	const [uz, setUz] = useState(item.uz);
	const [en, setEn] = useState(item.en);
	const { colorMode } = useColorMode();

	useEffect(() => {
		setUz(item.uz);
		setEn(item.en);
	}, [item]);

	const handleSave = async () => {
		try {
			await VocabularyService.updateDict({ id: item.id, uz, en });
			toaster.success({
				title: 'Updated',
				description: 'Word updated successfully!',
				closable: true,
			});
			onClose();
			onUpdated();
		} catch (error) {
			console.error('Update error:', error);
			toaster.error({ title: 'Error', description: 'Failed to update word.' });
		}
	};

	const dialogBg = colorMode === 'dark' ? '#040711' : '#eaefef';

	return (
		<Dialog.Root open={isOpen}>
			<DialogBackdrop
				style={{
					backdropFilter: 'blur(6px)',
					backgroundColor: 'rgba(0, 0, 0, 0.4)',
				}}
			/>

			<DialogPositioner
				display='flex'
				alignItems='center'
				justifyContent='center'
				minHeight='100vh'
				padding='4'
			>
				<DialogContent
					bg={dialogBg}
					width='100%'
					maxW={{ base: '100%', sm: '90%', md: '500px' }}
					borderRadius={{ base: 'md', md: 'xl' }}
					boxShadow='lg'
				>
					<DialogHeader>
						<DialogTitle>Edit Word</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Stack gap={4}>
							<Input
								placeholder='English'
								value={en}
								onChange={e => setEn(e.target.value)}
								size='md'
							/>
							<Input
								placeholder='Uzbek'
								value={uz}
								onChange={e => setUz(e.target.value)}
								size='md'
							/>
						</Stack>
					</DialogBody>
					<DialogFooter flexWrap='wrap' gap={2}>
						<Dialog.ActionTrigger asChild>
							<Button
								variant='outline'
								onClick={onClose}
								w={{ base: '100%', md: 'auto' }}
								color={colorMode === 'dark' ? 'white' : 'gray.800'}
							>
								Cancel
							</Button>
						</Dialog.ActionTrigger>
						<Button onClick={handleSave} w={{ base: '100%', md: 'auto' }}>
							Save
						</Button>
					</DialogFooter>
					<DialogCloseTrigger asChild>
						<CloseButton size='sm' position='absolute' top='3' right='3' />
					</DialogCloseTrigger>
				</DialogContent>
			</DialogPositioner>
		</Dialog.Root>
	);
};
