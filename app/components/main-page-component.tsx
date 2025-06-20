'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { cards, features } from '@/config';
import { BaseInterface } from '@/interfaces/base.interface';
import { BaseService } from '@/services/base';
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

const MainPageComponent = () => {
	const { colorMode } = useColorMode();
	const [appearance, setAppearance] = useState<BaseInterface[]>([]);
	const router = useRouter();

	const bgGradient =
		colorMode === 'dark'
			? 'linear(to-br, #0f0c29, #302b63, #24243e)'
			: 'linear(to-br, #e0eafc, #cfdef3)';
	const textColor = colorMode === 'dark' ? 'white' : 'gray.800';
	const headingColor = colorMode === 'dark' ? 'blue.500' : 'blue.600';
	const subtitleColor = colorMode === 'dark' ? 'gray.300' : 'gray.600';

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await BaseService.appearance();
				setAppearance(response);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	return (
		<Box
			px={{ base: 4, sm: 6, md: 16 }}
			py={{ base: 12, md: 20 }}
			bgGradient={bgGradient}
			color={textColor}
			textAlign='center'
			mt={10}
			transition='all 0.3s ease'
		>
			{appearance.map((item, idx) => {
				const nameWithoutAcademy = item.name.replace(/Academy/i, '').trim();

				return (
					<Fragment key={item.id}>
						<Heading fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }} fontWeight='extrabold' mb={4}>
							<Text
								as='span'
								bgGradient={
									colorMode === 'dark'
										? 'linear(to-r, #9f00ff, #00d4ff)'
										: 'linear(to-r, #4a00e0, #8e2de2)'
								}
								bgClip='text'
								color={headingColor}
							>
								{nameWithoutAcademy}
							</Text>{' '}
							- Academy
						</Heading>

						<Text
							fontSize={{ base: 'sm', md: 'lg' }}
							maxW={{ base: '90%', md: '720px' }}
							mx='auto'
							color={subtitleColor}
							mb={10}
							lineHeight='tall'
						>
							{item.description}
						</Text>

						{/* Features */}
						<Flex
							justify={{ base: 'center', md: 'center' }}
							align='center'
							gap={{ base: 4, md: 8 }}
							flexWrap='wrap'
							fontWeight='medium'
							fontSize={{ base: 'sm', md: 'md' }}
							mb={16}
						>
							{features.map((feature, index) => (
								<Flex key={index} align='center' gap={2}>
									<Icon as={feature.icon} color='green.500' boxSize={5} />
									<Text>{feature.title}</Text>
								</Flex>
							))}
						</Flex>

						{/* Cards */}
						<Flex justify='center' flexWrap='wrap' gap={{ base: 6, md: 10 }}>
							{cards.map((card, idx) => {
								return (
									<Box
										key={idx}
										bg={card.gradient}
										p={{ base: 6, md: 8 }}
										rounded='2xl'
										maxW={{ base: '100%', sm: '320px', md: 'sm' }}
										w='full'
										textAlign='center'
										color={colorMode === 'dark' ? 'white' : 'gray.800'}
										boxShadow='0 8px 30px rgba(0, 0, 0, 0.2)'
										backdropFilter='blur(10px)'
										bgBlendMode='overlay'
										border='1px solid rgba(255,255,255,0.15)'
										transition='all 0.4s ease'
										_hover={{
											transform: 'translateY(-8px) scale(1.03)',
											boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
											filter: 'brightness(1.05)',
										}}
									>
										<Box
											display='flex'
											alignItems='center'
											justifyContent='center'
											w={{ base: 16, md: 20 }}
											h={{ base: 16, md: 20 }}
											bgGradient={card.iconGradient}
											rounded='full'
											mx='auto'
											mb={{ base: 4, md: 6 }}
											boxShadow={`0 4px 20px rgba(0, 0, 0, 0.3), ${card.glow}`}
											border='2px solid rgba(255, 255, 255, 0.2)'
											transition='all 0.4s ease'
											_hover={{
												transform: 'scale(1.1)',
												boxShadow: `0 6px 25px rgba(0, 0, 0, 0.5), ${card.glow}`,
											}}
										>
											<Icon
												as={card.icon}
												boxSize={{ base: 8, md: 10 }}
												color={colorMode === 'dark' ? 'white' : 'gray.800'}
											/>
										</Box>

										<Heading fontSize={{ base: 'lg', md: 'xl' }} mb={3}>
											{card.title}
										</Heading>
										<Text
											fontSize={{ base: 'xs', md: 'sm' }}
											mb={6}
											color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
											lineHeight='shorter'
										>
											{card.description}
										</Text>
										<Button
											bg={card.buttonBgColor}
											color={card.buttonColor}
											fontWeight='bold'
											fontSize={{ base: 'sm', md: 'md' }}
											w='full'
											textShadow='0 1px 2px rgba(0,0,0,0.7)'
											transition='all 0.3s ease'
											onClick={() => router.push(card.link)}
										>
											{card.buttonText}
										</Button>
									</Box>
								);
							})}
						</Flex>

						{/* Stats Section */}
						<Flex
							justify='space-around'
							align='center'
							gap={{ base: 6, md: 8 }}
							flexWrap='wrap'
							mb={5}
							mt={20}
						>
							{[
								{
									value: item.statistics_o,
									label: 'AI Conversations',
									sublabel: 'Neural responses generated',
								},
								{
									value: item.statistics_t,
									label: 'Words Analyzed',
									sublabel: 'By our AI engine',
								},
								{
									value: item.statistics_th,
									label: 'AI Accuracy',
									sublabel: 'Speech recognition rate',
								},
								{
									value: item.statistics_f,
									label: 'AI Availability',
									sublabel: 'Always learning with you',
								},
							].map((stat, idx) => (
								<Box
									key={idx}
									textAlign='center'
									px={{ base: 4, md: 8 }}
									py={{ base: 6, md: 8 }}
									bg={colorMode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'gray.100'}
									border={
										colorMode === 'dark'
											? '1px solid rgba(255, 255, 255, 0.1)'
											: '1px solid rgba(0, 0, 0, 0.05)'
									}
									borderRadius='2xl'
									boxShadow={
										colorMode === 'dark'
											? '0 4px 20px rgba(0,0,0,0.2)'
											: '0 4px 20px rgba(0,0,0,0.05)'
									}
									minW={{ base: '100%', md: '250px' }}
									transition='all 0.3s ease'
									_hover={{
										transform: 'translateY(-6px) scale(1.02)',
										boxShadow:
											colorMode === 'dark'
												? '0 6px 30px rgba(0,0,0,0.35)'
												: '0 6px 30px rgba(0,0,0,0.1)',
									}}
								>
									<Text
										fontSize={{ base: '2xl', md: '4xl' }}
										fontWeight='bold'
										color={colorMode === 'dark' ? 'white' : 'gray.800'}
										mb={1}
									>
										{stat.value}
									</Text>
									<Text
										fontSize={{ base: 'sm', md: 'md' }}
										fontWeight='semibold'
										color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
									>
										{stat.label}
									</Text>
									<Text
										fontSize={{ base: 'xs', md: 'sm' }}
										color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
									>
										{stat.sublabel}
									</Text>
								</Box>
							))}
						</Flex>
					</Fragment>
				);
			})}
		</Box>
	);
};

export default MainPageComponent;
