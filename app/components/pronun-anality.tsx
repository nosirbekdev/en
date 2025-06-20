import { useColorMode } from '@/components/ui/color-mode';
import { getPronunciationFeedback } from '@/config';
import {
	AbsoluteCenter,
	Badge,
	Box,
	Flex,
	HStack,
	ProgressCircle,
	Stat,
	Text,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';

interface PronunciationResult {
	pronunciation_score_percent: number;
	predicted_text: string;
	reference_text: string;
	status: string;
	phone_level_alignment: {
		aligned_words: number;
		total_words: number;
		alignment_score: number;
		avg_word_duration: number;
	};
	mispronounced_words: string[];
}

interface Props {
	result: PronunciationResult;
}

const PronunciationAnalysis = ({ result }: Props) => {
	const { colorMode } = useColorMode();

	const words = result.reference_text
		.replace(/\r|\n/g, '')
		.split(' ')
		.filter(w => w.trim() !== '');

	const correctWords = words.filter(
		word => !result.mispronounced_words.includes(word.toLowerCase())
	);
	const incorrectWords = result.mispronounced_words;

	const feedback = getPronunciationFeedback(result.pronunciation_score_percent);

	return (
		<Box
			p={{ base: 4, md: 6 }}
			borderRadius='xl'
			boxShadow='xl'
			w='100%'
			mt={10}
			bg={colorMode === 'dark' ? '' : 'white'}
			border={colorMode === 'dark' ? '1px solid gray.700' : '1px solid gray.200'}
		>
			<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold' mb={4}>
				Pronunciation Analysis
			</Text>

			<Flex justifyContent='center' mb={4}>
				<ProgressCircle.Root value={result.pronunciation_score_percent} size='xl'>
					<ProgressCircle.Circle>
						<ProgressCircle.Track />
						<ProgressCircle.Range />
					</ProgressCircle.Circle>
					<AbsoluteCenter>
						<ProgressCircle.ValueText />
					</AbsoluteCenter>
				</ProgressCircle.Root>
			</Flex>

			<Text fontWeight='medium' mb={2} textAlign='center' fontSize={{ base: 'sm', md: 'md' }}>
				Overall Pronunciation Score
			</Text>

			<Wrap justify='center' spaceX={2} my={4}>
				{words.map((word, idx) => {
					const isIncorrect = incorrectWords.includes(word.toLowerCase());
					return (
						<WrapItem key={idx}>
							<Badge
								px={3}
								py={1}
								borderRadius='full'
								bg={isIncorrect ? 'red.500' : 'green.500'}
								color='white'
								fontSize='sm'
							>
								{word}
							</Badge>
						</WrapItem>
					);
				})}
			</Wrap>

			<Box
				bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
				borderRadius='md'
				p={4}
				my={4}
				textAlign='left'
			>
				<Text fontWeight='semibold' fontSize={{ base: 'sm', md: 'md' }} color={feedback.color}>
					AI Feedback: {feedback.label}
				</Text>
				<Text fontSize='sm' mt={1} color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
					{feedback.message}
				</Text>
			</Box>

			<HStack spaceX={{ base: 0, md: 4 }} justifyContent='center' flexWrap={'wrap'} mt={6}>
				<Stat.Root borderWidth='1px' p='4' rounded='md'>
					<Stat.ValueText>{correctWords.length}</Stat.ValueText>
					<Stat.Label>Correct Words</Stat.Label>
				</Stat.Root>
				<Stat.Root borderWidth='1px' p='4' rounded='md'>
					<Stat.ValueText>{incorrectWords.length}</Stat.ValueText>
					<Stat.Label>Need Practice</Stat.Label>
				</Stat.Root>
				<Stat.Root borderWidth='1px' p='4' rounded='md'>
					<Stat.ValueText>{words.length}</Stat.ValueText>
					<Stat.Label>Total Words</Stat.Label>
				</Stat.Root>
				<Stat.Root borderWidth='1px' p='4' rounded='md'>
					<Stat.ValueText>
						{Math.round(result.phone_level_alignment.alignment_score * 100)}%
					</Stat.ValueText>
					<Stat.Label>Avg. Word Score</Stat.Label>
				</Stat.Root>
			</HStack>
		</Box>
	);
};

export default PronunciationAnalysis;
