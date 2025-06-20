'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useColorMode } from './ui/color-mode';

const DashboardFooter = () => {
	const { colorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const bgColor = mounted ? (colorMode === 'dark' ? '#040711' : '#eaefef') : '#040711';

	const borderColor = mounted ? (colorMode === 'dark' ? 'gray.200' : 'gray.400') : 'gray.200';

	return (
		<Box
			as='footer'
			w='full'
			py={4}
			px={6}
			bg={bgColor}
			borderTop='1px solid'
			borderColor={borderColor}
			mt='auto'
		>
			<Flex justify='center' align='center'>
				<Text fontSize='sm' color='gray.600' _dark={{ color: 'gray.400' }}>
					© {new Date().getFullYear()} En Admin Panel. Barcha huquqlar himoyalangan.
				</Text>
			</Flex>
		</Box>
	);
};

export default DashboardFooter;
