'use client';

import { Box, Button, Container, HStack, Icon, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { RiBookOpenLine } from 'react-icons/ri';
import { useColorMode } from './ui/color-mode';

interface SidebarProps {
	toggle: boolean;
	onClose: () => void;
}

const navigation = [
	{
		title: 'Users',
		links: [
			{
				route: '/instructor/users',
				icon: FaUsers,
			},
		],
	},
	{
		title: 'Pronunciation',
		links: [
			{
				route: '/instructor/dict',
				icon: RiBookOpenLine,
			},
		],
	},
];

const Sidebar = ({ toggle, onClose }: SidebarProps) => {
	const { colorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		setMounted(true);
	}, []);

	const bgColor = useMemo(() => {
		if (!mounted) return '#040711'; // default color to prevent mismatch
		return colorMode === 'dark' ? '#040711' : '#eaefef';
	}, [mounted, colorMode]);
	const border = mounted ? (colorMode === 'dark' ? 'gray.200' : 'gray.400') : 'gray.200';

	return (
		<Box
			zIndex={999}
			w={{ base: 'full', lg: '300px' }}
			h={'90vh'}
			bg={bgColor}
			borderRight={'1px solid'}
			borderRightColor={border}
			pos={'fixed'}
			top={'10vh'}
			left={{ base: toggle ? 0 : '-100%', lg: 0 }}
			overflowY={'scroll'}
			css={{
				'&::-webkit-scrollbar': { width: '1px' },
				'&::-webkit-scrollbar-track': { width: '1px' },
				'&::-webkit-scrollbar-thumb': { background: 'transparent' },
			}}
			transition={'all .4s ease'}
		>
			<Container maxW={'container.xl'} mt={10}>
				{navigation.map((item, idx) => (
					<Box key={idx} mt={5}>
						{item.links.map(nav => {
							const active = pathname.startsWith(nav.route);

							return (
								<Link href={nav.route} key={nav.route}>
									<Button
										onClick={onClose}
										colorScheme='facebook'
										variant={active ? 'solid' : 'ghost'}
										w='full'
										justifyContent='flex-start'
										h={14}
									>
										<HStack gap={2}>
											{typeof nav.icon === 'string' ? (
												<img src={nav.icon} alt='' style={{ width: 24, height: 24 }} />
											) : (
												<>
													<Icon as={nav.icon} />
													<Text>{item.title}</Text>
												</>
											)}
										</HStack>
									</Button>
								</Link>
							);
						})}
					</Box>
				))}
			</Container>
		</Box>
	);
};

export default Sidebar;
