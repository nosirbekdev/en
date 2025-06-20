'use client';

import DashboardFooter from '@/components/dashboard-footer';
import DashboardHeader from '@/components/dashboard-header';
import Sidebar from '@/components/sidebar';
import { useColorMode } from '@/components/ui/color-mode';
import { Box, Container, Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

export default function InstructorMainContent({ children }: { children: React.ReactNode }) {
	const { colorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);
	const [toggle, setToggle] = useState<boolean>(false);

	const onToggle = () => setToggle(prev => !prev);

	useEffect(() => {
		setMounted(true);
	}, []);

	const bgColor = useMemo(() => {
		if (!mounted) return '#040711'; // fallback SSR uchun
		return colorMode === 'dark' ? '#040711' : '#eaefef';
	}, [mounted, colorMode]);

	// ✅ Hydration mismatchni oldini olish uchun to‘liq clientda render qilinadi
	if (!mounted) return null;

	return (
		<Flex direction='column' minH='100vh' w='full' overflow='hidden' position='relative'>
			<DashboardHeader onToggle={onToggle} />
			<Flex flex='1' mt='11vh'>
				<Sidebar toggle={toggle} onClose={() => setToggle(false)} />
				<Box
					as='main'
					flex='1'
					pl={{ base: 0, lg: '300px' }}
					bg={bgColor}
					transition='all 0.4s ease'
					py={4}
				>
					<Container maxW='container.lg'>{children}</Container>
				</Box>
			</Flex>
			<DashboardFooter />
		</Flex>
	);
}
