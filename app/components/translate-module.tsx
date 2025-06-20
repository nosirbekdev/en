'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { TranslateService } from '@/services/translate';
import {
	Box,
	Combobox,
	HStack,
	IconButton,
	Portal,
	Stack,
	Text,
	Textarea,
	useFilter,
	useListCollection,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSwap, AiOutlineTranslation } from 'react-icons/ai';

// Supported languages
const languages = [
	{ label: 'English', value: 'en' },
	{ label: 'Uzbek', value: 'uz' },
];

// Combobox component
const LanguageCombobox = ({
	placeholder,
	value,
	onChange,
}: {
	placeholder: string;
	value: string;
	onChange: (val: string) => void;
}) => {
	const { contains } = useFilter({ sensitivity: 'base' });
	const { collection, filter } = useListCollection({
		initialItems: languages,
		filter: contains,
	});

	const { colorMode } = useColorMode();
	const inputColor = colorMode === 'dark' ? 'white' : 'gray.800';
	const placeholderColor = colorMode === 'dark' ? 'gray.400' : 'gray.600';
	const borderColor = colorMode === 'dark' ? 'gray.600' : 'gray.300';

	return (
		<Combobox.Root
			collection={collection}
			onInputValueChange={e => filter(e.inputValue)}
			width='100%'
		>
			<Combobox.Control>
				<Combobox.Input
					placeholder={placeholder}
					color={inputColor}
					borderColor={borderColor}
					_placeholder={{ color: placeholderColor }}
				/>
				<Combobox.IndicatorGroup>
					<Combobox.ClearTrigger />
					<Combobox.Trigger />
				</Combobox.IndicatorGroup>
			</Combobox.Control>
			<Portal>
				<Combobox.Positioner>
					<Combobox.Content color={inputColor}>
						<Combobox.Empty>No language found</Combobox.Empty>
						{collection.items.map(item => (
							<Combobox.Item item={item} key={item.value}>
								{item.label}
								<Combobox.ItemIndicator />
							</Combobox.Item>
						))}
					</Combobox.Content>
				</Combobox.Positioner>
			</Portal>
		</Combobox.Root>
	);
};

// Main Translation Module
const TranslationModule = () => {
	const { colorMode } = useColorMode();
	const [fromLang, setFromLang] = useState<'en' | 'uz'>('en');
	const [toLang, setToLang] = useState<'en' | 'uz'>('uz');
	const [inputText, setInputText] = useState('');
	const [translatedText, setTranslatedText] = useState('');

	const swapLanguages = () => {
		setFromLang(toLang);
		setToLang(fromLang);
		setInputText('');
		setTranslatedText('');
	};

	useEffect(() => {
		const controller = new AbortController();

		const translate = async () => {
			if (inputText.trim() === '') {
				setTranslatedText('');
				return;
			}
			try {
				const res = await TranslateService.translateText({
					text: inputText,
					text_lang: fromLang,
				});
				if (!controller.signal.aborted) {
					setTranslatedText(res[toLang] || '');
				}
			} catch (error) {
				if (!controller.signal.aborted) {
					setTranslatedText('❌ Translation failed.');
				}
			}
		};

		translate();

		return () => controller.abort(); // prev so‘rovni bekor qilamiz
	}, [inputText, toLang]);

	const borderColor = colorMode === 'dark' ? 'blue.600' : 'blue.300';
	const shadowColor = colorMode === 'dark' ? '#3f3fff' : '#90cdf4';
	const iconColor = colorMode === 'dark' ? '#66ccff' : '#2b6cb0';
	const headingColor = colorMode === 'dark' ? 'blue.300' : 'blue.600';

	return (
		<Box
			maxW='800px'
			mx='auto'
			mt={10}
			p={6}
			border='1px solid'
			borderColor={borderColor}
			borderRadius='xl'
			boxShadow={`0 0 20px ${shadowColor}`}
		>
			<HStack mb={4} alignItems='center'>
				<AiOutlineTranslation size={20} color={iconColor} />
				<Text color={headingColor} fontSize='md' fontWeight='bold'>
					Translation Module
				</Text>
			</HStack>

			<Stack mb={4} direction={{ base: 'column', md: 'row' }}>
				<Box flex='1'>
					<LanguageCombobox
						placeholder='From language'
						value={fromLang}
						onChange={val => setFromLang(val as 'en' | 'uz')}
					/>
				</Box>

				<IconButton
					aria-label='Swap languages'
					onClick={swapLanguages}
					variant='ghost'
					colorScheme='blue'
					alignSelf='center'
				>
					<AiOutlineSwap />
				</IconButton>

				<Box flex='1'>
					<LanguageCombobox
						placeholder='To language'
						value={toLang}
						onChange={val => setToLang(val as 'en' | 'uz')}
					/>
				</Box>
			</Stack>

			<SyncedTextareas
				inputText={inputText}
				setInputText={setInputText}
				translatedText={translatedText}
			/>
		</Box>
	);
};

export default TranslationModule;

const SyncedTextareas = ({
	inputText,
	setInputText,
	translatedText,
}: {
	inputText: string;
	setInputText: (text: string) => void;
	translatedText: string;
}) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const outputRef = useRef<HTMLTextAreaElement>(null);
	const { colorMode } = useColorMode();

	const syncHeights = () => {
		if (inputRef.current && outputRef.current) {
			inputRef.current.style.height = 'auto';
			outputRef.current.style.height = 'auto';
			const maxHeight = Math.max(
				inputRef.current.scrollHeight,
				outputRef.current.scrollHeight,
				100
			);
			inputRef.current.style.height = `${maxHeight}px`;
			outputRef.current.style.height = `${maxHeight}px`;
		}
	};

	useEffect(() => {
		syncHeights();
	}, [inputText, translatedText]);

	const inputColor = colorMode === 'dark' ? 'white' : 'gray.800';
	const borderColor = colorMode === 'dark' ? 'gray.600' : 'gray.300';
	const placeholderColor = colorMode === 'dark' ? 'gray.400' : 'gray.600';

	return (
		<Stack direction={{ base: 'column', md: 'row' }} w='100%'>
			<Textarea
				ref={inputRef}
				value={inputText}
				onChange={e => setInputText(e.target.value)}
				placeholder='Enter text'
				color={inputColor}
				borderColor={borderColor}
				_placeholder={{ color: placeholderColor }}
				resize='none'
				minH='100px'
				textTransform={'capitalize'}
			/>
			<Textarea
				ref={outputRef}
				value={translatedText}
				readOnly
				placeholder='Translation'
				color={inputColor}
				borderColor={borderColor}
				_placeholder={{ color: placeholderColor }}
				resize='none'
				minH='100px'
				textTransform={'capitalize'}
			/>
		</Stack>
	);
};
