'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { SpeechService } from '@/services/speech';
import { VocabularyService } from '@/services/vocabulary';
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	IconButton,
	Input,
	NativeSelect,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react'; // Toaster faylidan import qiling
import { BiEdit } from 'react-icons/bi';
import { FaCheckCircle, FaPlay, FaPlus, FaRegCircle, FaVolumeUp } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import PracticeDialog from './practice-dialog';
import { UpdateDialog } from './update-vocab';

const VocabularyComponent = () => {
	const { colorMode } = useColorMode();

	type VocabItem = { en: string; uz: string };
	const [vocabList, setVocabList] = useState<VocabItem[]>([]);
	const [selectedLang, setSelectedLang] = useState<'en' | 'uz'>('en');
	const [englishWord, setEnglishWord] = useState('');
	const [uzbekWord, setUzbekWord] = useState('');
	const [isPracticeOpen, setIsPracticeOpen] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [selectedItems, setSelectedItems] = useState<VocabItem[]>([]);

	const toggleSelectItem = (item: VocabItem) => {
		const isSelected = selectedItems.some(i => i.en === item.en && i.uz === item.uz);
		if (isSelected) {
			setSelectedItems(prev => prev.filter(i => i.en !== item.en || i.uz !== item.uz));
		} else {
			setSelectedItems(prev => [...prev, item]);
		}
	};

	const vocabularyListBg =
		colorMode === 'dark' ? 'rgba(10, 20, 30, 0.5)' : 'rgba(240, 248, 255, 0.5)';

	const glassBg = colorMode === 'dark' ? 'rgba(4, 7, 17, 0.4)' : 'rgba(255, 255, 255, 0.4)';

	const inputBorderColor = colorMode === 'dark' ? '' : 'gray.400';

	useEffect(() => {
		const fetchDict = async () => {
			const response = await VocabularyService.getDictList();
			setVocabList(response);
		};

		fetchDict();
	}, []);

	const handleAddWord = async () => {
		const word = selectedLang === 'en' ? englishWord.trim() : uzbekWord.trim();

		if (!word) {
			toaster.error({
				title: 'Error',
				description: 'Please enter a word.',
			});
			return;
		}

		try {
			const translated = await VocabularyService.addDictCreate({
				text: word,
				text_lang: selectedLang,
			});

			if (!translated) {
				throw new Error('Empty translated response');
			}

			toaster.success({
				title: 'Success',
				description: 'Word added successfully!',
				closable: true,
			});
			setEnglishWord('');
			setUzbekWord('');

			const updatedList = await VocabularyService.getDictList();
			setVocabList(updatedList);
		} catch (error) {
			console.error('Translation Error:', error);
			toaster.error({
				title: 'Translation Error',
				description: 'Could not translate the word.',
			});
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await VocabularyService.deleteDict(id);
			toaster.success({
				title: 'Deleted',
				description: 'Word deleted successfully!',
				closable: true,
			});

			// Listani yangilash
			const updatedList = await VocabularyService.getDictList();
			setVocabList(updatedList);
		} catch (error) {
			console.error('Delete error:', error);
			toaster.error({ title: 'Error', description: 'Failed to delete word.', closable: true });
		}
	};

	const handleUpdate = (item: any) => {
		setSelectedItem(item);
		setIsUpdateOpen(true);
	};

	const handlePlaySound = async (text: string) => {
		try {
			const blob = await SpeechService.speech({
				text,
				type: 'tts',
				lang_text: 'en',
			});

			const url = URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' }));
			const audio = new Audio(url);
			audio.play();
		} catch (err) {
			console.error('Audio error:', err);
			toaster.error({
				title: 'Audio Error',
				description: 'Could not play pronunciation.',
			});
		}
	};

	return (
		<Box mt={20} mb={20} px={{ base: 4, md: 10 }}>
			<Heading
				textAlign='center'
				fontSize={{ base: '2xl', md: '4xl' }}
				fontWeight='bold'
				color='purple.400'
				mb={5}
			>
				Vocabulary Builder
			</Heading>
			<Text textAlign='center' fontSize='md' color='gray.400' mb={10}>
				Build and practice your English vocabulary with Uzbek translations
			</Text>

			<Container maxW='6xl'>
				<Flex
					flexDirection={{ base: 'column', md: 'row' }}
					justify='center'
					align='flex-start'
					gap={8}
				>
					{/* Left - Your Vocabulary */}
					<Box
						width={{ base: '100%', md: 'auto' }}
						flex={{ base: 0, md: 2 }}
						p={6}
						borderRadius='xl'
						boxShadow='lg'
						bg={glassBg}
						backdropFilter='blur(20px)'
						border='1px solid'
						borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
					>
						<Text fontWeight='semibold' mb={4}>
							Your Vocabulary
						</Text>
						<VStack align='stretch'>
							{vocabList.map((item: any, idx) => (
								<Flex
									key={idx}
									direction={{ base: 'column', md: 'row' }}
									justify='space-between'
									align={{ base: 'flex-start', md: 'center' }}
									px={4}
									py={3}
									borderRadius='md'
									bg={vocabularyListBg}
									backdropFilter='blur(20px)'
									boxShadow='sm'
									gap={2}
								>
									<Text color={colorMode === 'dark' ? 'white' : 'gray.800'} className='capitalize'>
										<strong className='capitalize'>{item.en}</strong> - {item.uz}
									</Text>
									<HStack>
										<IconButton
											aria-label='Select word'
											size='sm'
											variant='ghost'
											onClick={() => toggleSelectItem(item)}
										>
											{selectedItems.some(i => i.en === item.en && i.uz === item.uz) ? (
												<FaCheckCircle color='green' />
											) : (
												<FaRegCircle />
											)}
										</IconButton>

										<IconButton
											aria-label='Play pronunciation'
											size='sm'
											variant='ghost'
											color={colorMode === 'dark' ? 'white' : 'gray.800'}
											onClick={() => handlePlaySound(item.en)}
										>
											<FaVolumeUp />
										</IconButton>

										<IconButton
											aria-label='Edit word'
											size='sm'
											variant='ghost'
											color={colorMode === 'dark' ? 'white' : 'gray.800'}
											onClick={() => handleUpdate(item)}
										>
											<BiEdit />
										</IconButton>

										<IconButton
											aria-label='Delete word'
											size='sm'
											variant='ghost'
											color={colorMode === 'dark' ? 'white' : 'gray.800'}
											onClick={() => handleDelete(item.id)}
										>
											<MdDelete />
										</IconButton>
									</HStack>
								</Flex>
							))}
						</VStack>
					</Box>

					{/* Right - Add Word + Practice */}
					<VStack flex='1' align='stretch' w='full' minW={{ base: 'auto', md: '350px' }}>
						<Box
							p={6}
							borderRadius='xl'
							boxShadow='lg'
							bg={glassBg}
							backdropFilter='blur(20px)'
							border='1px solid'
							borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
						>
							<Text fontWeight='semibold' mb={4}>
								Add New Word
							</Text>
							<VStack>
								<Flex gap={3} align='center'>
									<Input
										placeholder={selectedLang === 'en' ? 'Enter English word' : 'Enter Uzbek word'}
										borderColor={inputBorderColor}
										borderWidth='1px'
										_hover={{
											borderColor: colorMode === 'dark' ? 'gray.500' : 'gray.500',
										}}
										_focus={{
											borderColor: colorMode === 'dark' ? 'purple.400' : 'purple.500',
											boxShadow: 'none',
										}}
										value={selectedLang === 'en' ? englishWord : uzbekWord}
										onChange={e =>
											selectedLang === 'en'
												? setEnglishWord(e.target.value)
												: setUzbekWord(e.target.value)
										}
									/>

									<NativeSelect.Root width='90px'>
										<NativeSelect.Field
											value={selectedLang}
											onChange={e => setSelectedLang(e.target.value as 'en' | 'uz')}
										>
											<option value='uz'>O'z</option>
											<option value='en'>En</option>
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
								</Flex>

								<Button
									w='full'
									bg='linear-gradient(to right, #C30EFF, #1E92FF)'
									color='white'
									_hover={{
										bg: 'linear-gradient(to right, #b00be6, #1a82e6)',
										opacity: 0.9,
									}}
									_active={{
										transform: 'scale(0.98)',
									}}
									_focus={{
										boxShadow: 'none',
									}}
									onClick={handleAddWord}
								>
									<FaPlus /> Add Word
								</Button>
							</VStack>
						</Box>

						<Box
							p={6}
							borderRadius='xl'
							boxShadow='lg'
							bg={glassBg}
							backdropFilter='blur(20px)'
							border='1px solid'
							borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
							textAlign='center'
							mt={5}
						>
							<Text mb={2} fontWeight='medium'>
								Practice
							</Text>
							<Text fontSize='2xl' fontWeight='bold' mb={4} color='purple.400'>
								{vocabList.length}
							</Text>
							<Text mb={4} color='gray.400'>
								Words in Dictionary
							</Text>
							<Button
								w='full'
								disabled={selectedItems.length === 0}
								bg='linear-gradient(to right, #C30EFF, #1E92FF)'
								color='white'
								_hover={{
									bg: 'linear-gradient(to right, #b00be6, #1a82e6)',
									opacity: 0.9,
								}}
								_active={{
									transform: 'scale(0.98)',
								}}
								_focus={{
									boxShadow: 'none',
								}}
								onClick={() => {
									setCurrentWordIndex(0);
									setIsPracticeOpen(true);
								}}
							>
								<FaPlay />
								Start Practice
							</Button>
						</Box>
					</VStack>
				</Flex>
			</Container>
			<PracticeDialog
				isOpen={isPracticeOpen}
				onClose={setIsPracticeOpen}
				word={selectedItems}
				onPlaySound={handlePlaySound}
			/>

			{selectedItem && (
				<UpdateDialog
					isOpen={isUpdateOpen}
					onClose={() => setIsUpdateOpen(false)}
					item={selectedItem}
					onUpdated={async () => {
						const updated = await VocabularyService.getDictList();
						setVocabList(updated);
					}}
				/>
			)}
		</Box>
	);
};

export default VocabularyComponent;
