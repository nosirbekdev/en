import { AiOutlineGlobal } from 'react-icons/ai';
import { BiCool, BiMicrophone } from 'react-icons/bi';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import { FaRegCommentDots } from 'react-icons/fa';
import { PiBookOpenTextLight } from 'react-icons/pi';

export const navLinks = [
	{ label: 'Home', path: '/' },
	{ label: 'AI chat', path: '/ai-chat' },
	{ label: 'Pronunciation', path: '/pronunciation' },
	{ label: 'Vocabulary', path: '/vocabulary' },
	{ label: 'Login', path: '/login' },
];

export const navLinksFooter = [
	{ label: 'Home', path: '/' },
	{ label: 'AI chat', path: '/ai-chat' },
	{ label: 'Pronunciation', path: '/pronunciation' },
	{ label: 'Vocabulary', path: '/vocabulary' },
];

export const cards = [
	{
		title: 'AI Conversation Partner',
		description:
			'Engage in natural, intelligent conversations with our advanced AI tutor. Get instant translations, contextual explanations, and personalized feedback on your English skills.',
		buttonText: 'Start AI Chat',
		icon: FaRegCommentDots,
		gradient: 'linear(to-br, #4f46e5, #0ea5e9)', // Indigo to Cyan
		iconGradient: 'linear(to-br, #4f46e5, #0ea5e9)',
		glow: '0 0 20px rgba(14,165,233,0.4)',
		buttonColor: 'white',
		buttonBgColor: 'green.500',
		link: '/ai-chat',
	},
	{
		title: 'AI Pronunciation Coach',
		description:
			'Perfect your pronunciation with our AI-powered speech analysis. Get detailed feedback, pronunciation scores, and personalized improvement suggestions.',
		buttonText: 'Practice Speaking',
		icon: BiMicrophone,
		gradient: 'linear(to-br, #8b5cf6, #9333ea)', // Violet to Purple
		iconGradient: 'linear(to-br, #8b5cf6, #9333ea)',
		glow: '0 0 20px rgba(147,51,234,0.4)',
		buttonColor: 'white',
		buttonBgColor: 'purple.500',
		link: '/pronunciation',
	},
	{
		title: 'AI Vocabulary Builder',
		description:
			'Build your vocabulary with intelligent spaced repetition and AI-powered translations. Our system adapts to your learning pace and remembers your progress.',
		buttonText: 'Build Vocabulary',
		icon: PiBookOpenTextLight,
		gradient: 'linear(to-br, #14b8a6, #0ea5e9)', // Teal to Blue
		iconGradient: 'linear(to-br, #14b8a6, #0ea5e9)',
		glow: '0 0 20px rgba(14,165,233,0.3)',
		buttonColor: 'white',
		buttonBgColor: 'teal.500',
		link: '/vocabulary',
	},
];

export const features = [
	{ title: 'Instant AI Feedback', icon: BsFillLightningChargeFill },
	{ title: '24/7 AI Practice Partner', icon: AiOutlineGlobal },
	{ title: 'Personalized Learning', icon: BiCool },
];

export const formatPhoneNumber = (phone: string) => {
	const digits = phone.replace(/\D/g, '');

	if (digits.length === 12 && digits.startsWith('998')) {
		const code = digits.slice(3, 5); // 90
		const part1 = digits.slice(5, 8); // 500
		const part2 = digits.slice(8, 10); // 55
		const part3 = digits.slice(10); // 55
		return `+998${code}-${part1}-${part2}-${part3}`;
	}

	return phone;
};

export const getPronunciationFeedback = (score: number) => {
	if (score >= 90) {
		return {
			label: 'Excellent!',
			message: 'Fantastic! Your pronunciation is excellent. Keep it up!',
			color: 'green.500',
		};
	}
	if (score >= 75) {
		return {
			label: 'Great!',
			message: 'Very good! Just a little more practice to reach perfection.',
			color: 'blue.500',
		};
	}
	if (score >= 50) {
		return {
			label: 'Good',
			message: 'Not bad, but you should work on some words.',
			color: 'orange.400',
		};
	}
	return {
		label: 'Needs Improvement',
		message: 'Try again and focus on clear pronunciation.',
		color: 'red.500',
	};
};

export const voiceOptions = [
	{ value: 'af_bella', label: 'Female (US)', lang_code: 'a' },
	{ value: 'bf_isabella', label: 'Female (UK)', lang_code: 'b' },
	{ value: 'am_michael', label: 'Male (US)', lang_code: 'a' },
	{ value: 'bm_lewis', label: 'Male (UK)', lang_code: 'b' },
];

export const getLevelFromStep = (stepIndex: number): number => {
	if (stepIndex <= 1) return 1; // A1, A2
	if (stepIndex <= 3) return 2; // B1, B2
	return 3; // C1, C2
};

export const steps = [
	{
		idx: 'A1',
		description: "You're just starting and can handle basic English.",
		level: 1,
	},
	{
		idx: 'A2',
		description: 'You can communicate simple ideas and understand familiar topics.',
		level: 1,
	},
	{
		idx: 'B1',
		description:
			'You can handle everyday conversations and express yourself in familiar situations.',
		level: 2,
	},
	{
		idx: 'B2',
		description:
			'You can engage in more complex discussions and understand main ideas in various subjects.',
		level: 2,
	},
	{
		idx: 'C1',
		description:
			'You can discuss a wide range of topics in detail and fluently express nuanced ideas.',
		level: 3,
	},
	{
		idx: 'C2',
		description:
			'You have a near-native command of English, able to understand and engage with advanced topics.',
		level: 3,
	},
];
