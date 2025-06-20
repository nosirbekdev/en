'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { PronunciationService } from '@/services/pronun';
import { SpeechService } from '@/services/speech';
import { Box, Button, Container, Flex, Heading, HStack, Text, Textarea } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaRegCirclePlay, FaRegCircleStop } from 'react-icons/fa6';
import { IoMdRefresh } from 'react-icons/io';
import MicrophoneButton from './microfon';
import PronunciationAnalysis from './pronun-anality';

const PronunciationComponent = () => {
	const [practiceText, setPracticeText] = useState('Enter your own sentence to practice...');
	const [customText, setCustomText] = useState('');
	const [showCustomInput, setShowCustomInput] = useState(false);
	const { colorMode } = useColorMode();
	const [defaultText, setDefaultText] = useState<string | null>(null);
	const [randomTexts, setRandomTexts] = useState<Array<{ text: string }>>([]);
	const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [result, setResult] = useState<any | null>(null);

	useEffect(() => {
		const fetchTexts = async () => {
			try {
				const data = await PronunciationService.getPronunDef();

				if (Array.isArray(data) && data.length > 0) {
					setDefaultText(data[0].text);
					setPracticeText(data[0].text);
					setRandomTexts(data.slice(1));
				}
			} catch (error) {
				console.error('Failed to fetch practice text:', error);
				if (
					typeof error === 'object' &&
					error !== null &&
					'response' in error &&
					typeof (error as any).response === 'object' &&
					'data' in (error as any).response &&
					typeof (error as any).response.data === 'object' &&
					'detail' in (error as any).response.data
				) {
					toaster.error({
						title: (error as any).response.data.detail,
						description: (error as any).message,
					});
				} else {
					toaster.error({
						title: 'Failed to fetch practice text',
						description: String(error),
					});
				}
			}
		};

		fetchTexts();
	}, []);

	const handleRandomText = () => {
		// Avval audio to‘xtatiladi
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setIsPlaying(false);
		}

		setCustomText('');
		setShowCustomInput(false);

		if (randomTexts.length === 0) {
			setPracticeText(defaultText || 'No text available');
			return;
		}

		// Random tanlash
		const randomIndex = Math.floor(Math.random() * randomTexts.length);
		const selectedText = randomTexts[randomIndex].text;

		setPracticeText(selectedText);
		setAudioBlobUrl(null); // eski blob URL'ni tozalab yuboramiz
	};

	const handleUseText = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setIsPlaying(false);
		}

		if (customText.trim()) {
			setPracticeText(customText);
			setShowCustomInput(false);
			setCustomText('');
			setAudioBlobUrl(null); // eski audio'ni tozalash
		}
	};

	const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const wordCount = e.target.value.trim().split(/\s+/).length;
		if (wordCount <= 300) {
			setCustomText(e.target.value);
		}
	};

	const handleSpeechPlay = async () => {
		try {
			const blob = await SpeechService.speech({
				lang_text: 'en', // yoki boshqa tanlangan til
				text: practiceText,
				type: 'tts',
			});

			const url = URL.createObjectURL(blob);
			setAudioBlobUrl(url);

			// Yangi audio yaratish va o‘ynatish
			const audio = new Audio(url);
			audioRef.current = audio;

			audio.play();
			setIsPlaying(true);

			audio.onended = () => setIsPlaying(false);
		} catch (error) {
			console.error('Speech failed:', error);
		}
	};

	const handleToggleAudio = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	return (
		<Box
			minH='100vh'
			mt={{ base: 10, md: 20 }}
			mb={{ base: 10, md: 20 }}
			color={colorMode === 'dark' ? 'white' : 'black'}
			px={{ base: 4, md: 6 }}
			py={{ base: 6, md: 10 }}
			display='flex'
			flexDirection='column'
			alignItems='center'
		>
			{/* Title */}
			<Heading
				textAlign='center'
				fontSize={{ base: '2xl', md: '4xl' }}
				fontWeight='bold'
				color='purple.400'
				mb={2}
			>
				AI Pronunciation Practice
			</Heading>
			<Text
				textAlign='center'
				fontSize={{ base: 'sm', md: 'md' }}
				color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
				mb={10}
			>
				Record yourself reading the text and get AI feedback on your pronunciation.
			</Text>

			<Container
				maxW='6xl'
				px={{ base: 0, md: 6 }}
				display='flex'
				flexDirection='column'
				alignItems='center'
			>
				{/* Practice Section */}
				<Box
					p={{ base: 4, md: 6 }}
					borderRadius='xl'
					boxShadow='xl'
					w='100%'
					mb={10}
					bg={colorMode === 'dark' ? '' : 'white'}
					border={colorMode === 'dark' ? '1px solid gray.700' : '1px solid gray.200'}
				>
					<Flex
						justify='space-between'
						flexDirection={{ base: 'column', md: 'row' }}
						align={{ base: 'flex-start', md: 'center' }}
						mb={6}
					>
						<Heading
							fontSize='xl'
							color='purple.400'
							mb={{ base: 4, md: 0 }}
							borderBottom={colorMode === 'dark' ? '1px solid gray.700' : '1px solid gray.300'}
							pb={2}
							w='full'
						>
							Practice Text
						</Heading>

						<HStack flexWrap={{ base: 'wrap', md: 'nowrap' }}>
							<Button
								variant='ghost'
								border='1px solid'
								borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
								_hover={{
									bg: colorMode === 'dark' ? 'teal.700' : 'purple.600',
									color: 'white',
								}}
								color={colorMode === 'dark' ? 'white' : 'black'}
								onClick={handleRandomText}
								size='sm'
								w={{ base: 'full', sm: 'auto' }}
							>
								<IoMdRefresh /> Random Text
							</Button>
							<Button
								variant='ghost'
								onClick={audioBlobUrl ? handleToggleAudio : handleSpeechPlay}
								border='1px solid'
								borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
								_hover={{
									bg: colorMode === 'dark' ? 'teal.700' : 'blue.500',
									color: 'white',
								}}
								color={colorMode === 'dark' ? 'white' : 'black'}
								size='sm'
								w={{ base: 'full', sm: 'auto' }}
							>
								{isPlaying ? <FaRegCircleStop /> : <FaRegCirclePlay />}
								{isPlaying ? 'Stop' : 'Listen'}
							</Button>
						</HStack>
					</Flex>

					<Textarea
						value={practiceText}
						readOnly
						placeholder='Practice text will appear here'
						color={colorMode === 'dark' ? 'white' : 'black'}
						border='1px solid'
						borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
						mb={4}
						minH='200px'
						_placeholder={{
							color: colorMode === 'dark' ? 'gray.500' : 'gray.400',
						}}
					/>

					<Flex justify='space-between' align='center' mb={4} flexWrap='wrap'>
						<Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} mb={2}>
							Or enter your own text
						</Text>

						{!showCustomInput && (
							<Button
								onClick={() => setShowCustomInput(true)}
								size='sm'
								variant='ghost'
								border='1px solid'
								borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
								mb={2}
								w={{ base: 'full', sm: 'auto' }}
							>
								Add text
							</Button>
						)}
					</Flex>

					{showCustomInput && (
						<>
							<Textarea
								value={customText}
								onChange={handleCustomChange}
								placeholder='Enter your own sentence to practice...'
								color={colorMode === 'dark' ? 'white' : 'black'}
								border='1px solid'
								borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
								mb={4}
								minH='100px'
								_placeholder={{
									color: colorMode === 'dark' ? 'gray.500' : 'gray.400',
								}}
							/>
							<Text
								fontSize='sm'
								color={customText.trim().split(/\s+/).length > 300 ? 'red.400' : 'gray.500'}
								mb={2}
							>
								{customText.trim().split(/\s+/).length} / 300 so‘z
							</Text>
							<Button
								onClick={handleUseText}
								variant='ghost'
								border='1px solid'
								borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
								_hover={{
									bg: colorMode === 'dark' ? 'teal.700' : 'teal.500',
									color: 'white',
								}}
								color={colorMode === 'dark' ? 'white' : 'black'}
								size='sm'
							>
								Use This Text
							</Button>
						</>
					)}
				</Box>

				{/* Record Section */}
				<Box
					p={{ base: 4, md: 6 }}
					borderRadius='xl'
					textAlign='center'
					boxShadow='xl'
					w='100%'
					bg={colorMode === 'dark' ? '' : 'white'}
					border={colorMode === 'dark' ? '1px solid gray.700' : '1px solid gray.200'}
				>
					<Text
						fontWeight='medium'
						mb={4}
						fontSize={{ base: 'md', md: 'lg' }}
						color={colorMode === 'dark' ? 'white' : 'black'}
					>
						Record Your Pronunciation
					</Text>
					<MicrophoneButton practiceText={practiceText} onResult={res => setResult(res)} />
					<Text mt={4} color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
						Click to start recording
					</Text>
				</Box>
				{result && <PronunciationAnalysis result={result} />}
			</Container>
		</Box>
	);
};

export default PronunciationComponent;
