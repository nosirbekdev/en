'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { Tooltip } from '@/components/ui/tooltip';
import { getLevelFromStep, steps, voiceOptions } from '@/config';
import { AiChatService } from '@/services/ai-chat';
import {
	Alert,
	Button,
	Drawer,
	Flex,
	HStack,
	IconButton,
	NativeSelect,
	Portal,
	Steps,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiPencilSimpleLineFill } from 'react-icons/pi';

const languageLabelMap: Record<string, string> = {
	uz: 'Uzbek',
	en: 'English',
	ru: 'Russian',
};

const SettingsDrawer = () => {
	const { colorMode } = useColorMode();
	const [step, setStep] = useState(1);
	const [isLanguageSelectOpen, setIsLanguageSelectOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState('uz');
	const [selectedVoice, setSelectedVoice] = useState('af_bella');
	const [langCode, setLangCode] = useState('a');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const data = await AiChatService.getSettings();

				setLangCode(data.lang_code || 'a');
				setSelectedLanguage(data.language || 'uz');
				setSelectedVoice(data.voice || 'af_bella');

				// convert level to step index
				if (data.level === 1) setStep(0);
				else if (data.level === 2) setStep(2);
				else if (data.level === 3) setStep(4);
			} catch (err) {
				console.error('Failed to fetch settings:', err);
			}
		};
		fetchSettings();
	}, []);

	const handleSave = async () => {
		try {
			await AiChatService.settingsChat({
				lang_code: langCode,
				language: selectedLanguage,
				voice: selectedVoice,
				level: getLevelFromStep(step),
			});

			toaster.success({ title: 'Settings saved successfully!', closable: true });

			setIsDrawerOpen(false);
		} catch (err: any) {
			console.error('Failed to save settings:', err);

			const message =
				err?.response?.data?.message ||
				err?.message ||
				'Failed to save settings. Please try again.';

			toaster.error({
				title: 'Error saving settings',
				description: message,
				closable: true,
			});
		}
	};

	const isDark = colorMode === 'dark';
	const subTextColor = isDark ? 'gray.300' : 'gray.600';
	const bgColor = isDark ? '#040711' : '#eaefef';

	return (
		<HStack wrap='wrap'>
			<Drawer.Root
				size={'md'}
				open={isDrawerOpen}
				onOpenChange={details => setIsDrawerOpen(details.open)}
			>
				<Drawer.Trigger asChild>
					<IconButton
						aria-label='Settings'
						colorScheme='purple'
						variant='ghost'
						border={'1px solid'}
						borderColor={subTextColor}
						size={{ base: 'sm', md: 'md' }}
						onClick={() => setIsDrawerOpen(true)}
					>
						<IoSettingsOutline />
					</IconButton>
				</Drawer.Trigger>
				<Portal>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<Drawer.Content bg={bgColor}>
							<Drawer.Body mt={4}>
								<Flex alignItems='center' justifyContent='space-between'>
									<Drawer.Title>Settings</Drawer.Title>
									<Tooltip content='This is the tooltip content' openDelay={500} closeDelay={100}>
										<IconButton aria-label='Help' colorScheme='purple' variant='ghost'>
											<FaQuestionCircle />
										</IconButton>
									</Tooltip>
								</Flex>
								<Flex mt={4} mb={2} align='center' gap={2} fontSize='md'>
									<Text>Translation: {languageLabelMap[selectedLanguage] || selectedLanguage}</Text>
									<IconButton
										aria-label='Translate'
										colorScheme='purple'
										size='sm'
										variant='ghost'
										onClick={() => setIsLanguageSelectOpen(prev => !prev)}
									>
										<PiPencilSimpleLineFill />
									</IconButton>
									<Tooltip content='This is the tooltip content' openDelay={500} closeDelay={100}>
										<IconButton aria-label='Help' colorScheme='purple' variant='ghost' size='sm'>
											<FaQuestionCircle />
										</IconButton>
									</Tooltip>
								</Flex>
								{isLanguageSelectOpen && (
									<Flex mt={2} mb={4}>
										<NativeSelect.Root size='sm' width='full'>
											<NativeSelect.Field
												value={selectedLanguage}
												onChange={e => setSelectedLanguage(e.target.value)}
											>
												<option value='uz'>Uzbek</option>
											</NativeSelect.Field>
											<NativeSelect.Indicator />
										</NativeSelect.Root>
									</Flex>
								)}
								<Flex alignItems='center' justifyContent='space-between' mb={4}>
									<HStack>
										<Text fontSize='md' color={subTextColor}>
											Voice
										</Text>
										<Tooltip content='This is the tooltip content' openDelay={500} closeDelay={100}>
											<IconButton aria-label='Help' colorScheme='purple' variant='ghost'>
												<FaQuestionCircle />
											</IconButton>
										</Tooltip>
									</HStack>
									<NativeSelect.Root size='sm' width='240px'>
										<NativeSelect.Field
											value={selectedVoice}
											onChange={e => {
												const val = e.target.value;
												setSelectedVoice(val);
												const voiceObj = voiceOptions.find(v => v.value === val);
												if (voiceObj) {
													setLangCode(voiceObj.lang_code);
													setSelectedLanguage('uz');
												}
											}}
										>
											<option value='af_bella'>Female (US)</option>
											<option value='bf_isabella'>Female (UK)</option>
											<option value='am_michael'>Male (US)</option>
											<option value='bm_lewis'>Male (UK)</option>
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
								</Flex>
								<Flex alignItems='flex-start' flexDirection='column' mb={4} mt={5}>
									<HStack>
										<Text fontSize='md' color={subTextColor}>
											English Level
										</Text>
										<Tooltip content='This is the tooltip content' openDelay={500} closeDelay={100}>
											<IconButton aria-label='Help' colorScheme='purple' variant='ghost'>
												<FaQuestionCircle />
											</IconButton>
										</Tooltip>
									</HStack>
									<Steps.Root
										step={step}
										onStepChange={e => setStep(e.step)}
										count={steps.length}
										mt={4}
									>
										<Steps.List>
											{steps.map((stepItem, index) => (
												<Steps.Item
													key={index}
													index={index}
													onClick={() => setStep(index)}
													style={{ cursor: 'pointer' }}
												>
													<Steps.Indicator
														style={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															width: '40px',
															height: '40px',
															borderRadius: '50%',
															backgroundColor: index === step ? '#3182ce' : '#e2e8f0',
															color: index === step ? 'white' : 'black',
															fontWeight: 'bold',
														}}
													>
														{stepItem.idx}
													</Steps.Indicator>
													{index < steps.length - 1 && (
														<Steps.Separator bg='gray.300' height='2px' width='100%' my='auto' />
													)}
												</Steps.Item>
											))}
										</Steps.List>
									</Steps.Root>
								</Flex>
								<Alert.Root
									w='full'
									mb={4}
									bg={isDark ? '#131D4F' : 'white'}
									border='1px solid'
									borderColor={isDark ? 'gray.600' : ''}
									mt={5}
									color='white'
									borderRadius='md'
									px={4}
									py={3}
								>
									<Alert.Title
										fontWeight='semibold'
										color={isDark ? 'white' : 'black'}
										fontSize='md'
									>
										{steps[step].idx} — {steps[step].description}
									</Alert.Title>
								</Alert.Root>
								<Drawer.Footer display='flex' flexDirection='row' gap={4} w='full' mt={10}>
									<Drawer.ActionTrigger asChild>
										<Button variant='outline' flex='1'>
											Cancel
										</Button>
									</Drawer.ActionTrigger>
									<Button flex='3' onClick={handleSave}>
										Save
									</Button>
								</Drawer.Footer>
							</Drawer.Body>
						</Drawer.Content>
					</Drawer.Positioner>
				</Portal>
			</Drawer.Root>
		</HStack>
	);
};

export default SettingsDrawer;
