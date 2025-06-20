'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { API_URL, token } from '@/config/api-config';
import {
	Box,
	Button,
	Dialog,
	Flex,
	IconButton,
	Input,
	Portal,
	Progress,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaMicrophone, FaVolumeUp } from 'react-icons/fa';
import { IoMdClose, IoMdRefresh } from 'react-icons/io';

interface PracticeDialogProps {
	isOpen: boolean;
	onClose: (isOpen: boolean) => void;
	word: { en: string; uz: string }[];
	onPlaySound: (text: string) => void;
}

const PracticeDialog = ({ isOpen, onClose, word, onPlaySound }: PracticeDialogProps) => {
	const [answer, setAnswer] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [answeredCount, setAnsweredCount] = useState(0);
	const [showCorrect, setShowCorrect] = useState(false);

	const { colorMode } = useColorMode();
	const isMobile = useBreakpointValue({ base: true, md: false });
	const [isListening, setIsListening] = useState(false); // 🎧 indikator

	const currentWord = word[currentIndex];

	const SpeechRecognition =
		typeof window !== 'undefined'
			? (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any })
					.SpeechRecognition || (window as any).webkitSpeechRecognition
			: null;

	const handleSpeechInput = async () => {
		if (!navigator.mediaDevices || !window.MediaRecorder) {
			alert("Brauzeringiz audio yozishni qo'llab-quvvatlamaydi.");
			return;
		}

		setIsListening(true);

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			const audioChunks: Blob[] = [];

			mediaRecorder.ondataavailable = event => {
				if (event.data.size > 0) {
					audioChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

				const formData = new FormData();
				formData.append('lang_text', 'uz');
				formData.append('text', '');
				formData.append('type', 'stt');
				formData.append('audio', audioBlob, 'audio.webm');

				try {
					const response = await axios.post(`${API_URL}/speech`, formData, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					const transcript = await response.data;

					setAnswer(transcript.text);
				} catch (error) {
					console.error('APIga audio yuborishda xatolik:', error);
				}

				setIsListening(false);
			};

			mediaRecorder.start();

			// 3 soniya gapirishga vaqt
			setTimeout(() => {
				mediaRecorder.stop();
				stream.getTracks().forEach(track => track.stop()); // mikrofondan chiqish
			}, 3000);
		} catch (err) {
			console.error('Mikrofondan audio olishda xatolik:', err);
			setIsListening(false);
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setAnswer('');
			setCurrentIndex(0);
			setScore(0);
			setAnsweredCount(0);
			setShowCorrect(false);
		}
	}, [isOpen]);

	const handleCheckAnswer = () => {
		if (!answer.trim()) return;

		const isCorrect = answer.trim().toLowerCase() === currentWord.uz.toLowerCase();

		setAnsweredCount(prev => prev + 1);

		if (isCorrect) {
			setScore(prev => prev + 1);
			setShowCorrect(false);
			if (currentIndex < word.length - 1) {
				setCurrentIndex(prev => prev + 1);
				setAnswer('');
			} else {
				setTimeout(() => {
					onClose(false);
				}, 1500);
			}
		} else {
			setShowCorrect(true);
		}
	};

	const handleOpenChange = (details: { open: boolean }) => {
		onClose(details.open);
	};

	const dialogStyles = {
		position: 'fixed',
		top: '40%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		background: colorMode === 'dark' ? '#10182A' : '#FFFFFF',
		color: colorMode === 'dark' ? '#fff' : '#000',
		padding: isMobile ? '1rem' : '2rem',
		borderRadius: '1rem',
		width: isMobile ? '95%' : '90%',
		maxWidth: isMobile ? '100%' : '500px',
		zIndex: 1001,
		boxShadow:
			colorMode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
	};

	const backdropStyles = {
		backgroundColor: 'rgba(0,0,0,0.4)',
		backdropFilter: 'blur(6px)',
		WebkitBackdropFilter: 'blur(6px)',
		position: 'fixed',
		inset: 0,
		zIndex: 1000,
	};

	const buttonBg = colorMode === 'dark' ? 'gray.700' : 'gray.800';
	const buttonHoverBg = colorMode === 'dark' ? 'gray.600' : 'gray.700';

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
			<Portal>
				<Dialog.Backdrop style={backdropStyles as React.CSSProperties} />
				<Dialog.Content style={dialogStyles as React.CSSProperties}>
					<Flex justify='space-between' align='center' mb={isMobile ? 2 : 4}>
						<Text fontSize={isMobile ? 'lg' : 'xl'} fontWeight='bold'>
							Practice Session
						</Text>
						<IconButton
							aria-label='Close'
							onClick={() => onClose(false)}
							size={isMobile ? 'xs' : 'sm'}
							bg='transparent'
							color={colorMode === 'dark' ? 'white' : 'black'}
						>
							<IoMdClose />
						</IconButton>
					</Flex>

					<Progress.Root
						value={(answeredCount / word.length) * 100}
						size='sm'
						colorPalette='green'
						mb={isMobile ? 2 : 6}
					>
						<Progress.Track>
							<Progress.Range />
						</Progress.Track>
					</Progress.Root>

					<Text
						fontSize={isMobile ? 'xs' : 'sm'}
						color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
						mb={isMobile ? 1 : 2}
					>
						Listen and translate this word:
					</Text>

					<Flex align='center' justify='center' gap={isMobile ? 2 : 3} mb={isMobile ? 2 : 4}>
						<Text
							fontSize={isMobile ? 'xl' : '3xl'}
							fontWeight='bold'
							color='purple.400'
							className='capitalize'
						>
							{currentWord?.en.toLowerCase()}
						</Text>
						<IconButton
							aria-label='Play'
							size={isMobile ? 'xs' : 'sm'}
							bg={buttonBg}
							color='white'
							_hover={{ bg: buttonHoverBg }}
							onClick={() => onPlaySound(currentWord.en)}
						>
							<FaVolumeUp />
						</IconButton>
					</Flex>

					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						gap={isMobile ? 1 : 2}
						mb={isMobile ? 2 : 4}
					>
						<Input
							placeholder='Uzbek tarjimasini kiriting...'
							value={answer}
							onChange={e => setAnswer(e.target.value)}
							borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
							borderWidth='1px'
							_hover={{
								borderColor: colorMode === 'dark' ? 'gray.700' : 'gray.200',
							}}
							_focus={{ borderColor: 'purple.500', boxShadow: 'none' }}
							size={isMobile ? 'sm' : 'md'}
						/>
						<IconButton
							aria-label='Speech input'
							size={isMobile ? 'xs' : 'sm'}
							variant='ghost'
							border='1px solid'
							borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
							bg={colorMode === 'dark' ? 'transparent' : buttonBg}
							color='white'
							onClick={handleSpeechInput}
							disabled={isListening}
						>
							{isListening ? <Text fontSize='xs'>🎧...</Text> : <FaMicrophone />}
						</IconButton>
					</Box>

					{showCorrect && (
						<Text color='red.400' fontSize='sm' mb={2} textAlign='center'>
							Xato javob!
						</Text>
					)}

					<Button
						w={isMobile ? '100%' : 'auto'}
						bg='purple.600'
						_hover={{ bg: 'purple.500' }}
						color='white'
						size={isMobile ? 'sm' : 'md'}
						onClick={handleCheckAnswer}
					>
						Check Answer
					</Button>

					<Box
						display='flex'
						alignItems='center'
						mt={isMobile ? 2 : 6}
						justifyContent='space-between'
					>
						<Text
							fontSize={isMobile ? 'xs' : 'sm'}
							color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
							mt={isMobile ? 1 : 4}
						>
							✅ {score} / {word.length} ta to‘g‘ri, ❌ {answeredCount - score} noto‘g‘ri
						</Text>

						<Button
							variant='ghost'
							border='1px solid'
							borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
							_hover={{
								bg: colorMode === 'dark' ? 'teal.700' : 'teal.500',
								color: 'white',
							}}
							color={colorMode === 'dark' ? 'white' : 'black'}
							size={isMobile ? 'xs' : 'sm'}
							onClick={() => onClose(false)}
						>
							<IoMdRefresh /> Exit
						</Button>
					</Box>
				</Dialog.Content>
			</Portal>
		</Dialog.Root>
	);
};

export default PracticeDialog;
