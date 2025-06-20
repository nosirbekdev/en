'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

const AudioWaveVisualizer = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const animationIdRef = useRef<number>();

	useEffect(() => {
		const setupAudio = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				const audioContext = new (window.AudioContext || window.webkitAudioContext)();
				const source = audioContext.createMediaStreamSource(stream);
				const analyser = audioContext.createAnalyser();

				analyser.fftSize = 2048;
				source.connect(analyser);

				audioContextRef.current = audioContext;
				analyserRef.current = analyser;

				drawWave();
			} catch (err) {
				console.error('Microphone access error:', err);
			}
		};

		setupAudio();

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
			audioContextRef.current?.close();
		};
	}, []);

	const drawWave = () => {
		const canvas = canvasRef.current;
		const analyser = analyserRef.current;
		if (!canvas || !analyser) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const bufferLength = analyser.fftSize;
		const dataArray = new Uint8Array(bufferLength);

		const draw = () => {
			analyser.getByteTimeDomainData(dataArray);

			// Background
			ctx.fillStyle = '#0F0F0F';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Gradient line style
			const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
			gradient.addColorStop(0, '#C30EFF');
			gradient.addColorStop(0.5, '#1E92FF');
			gradient.addColorStop(1, '#00FFC6');

			ctx.lineWidth = 2;
			ctx.strokeStyle = gradient;

			ctx.beginPath();
			const sliceWidth = canvas.width / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = (v * canvas.height) / 2;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				x += sliceWidth;
			}

			ctx.lineTo(canvas.width, canvas.height / 2);
			ctx.stroke();

			animationIdRef.current = requestAnimationFrame(draw);
		};

		draw();
	};

	return (
		<Box
			// bg={useColorModeValue('gray.100', 'gray.900')}
			borderRadius='full'
			p={4}
			boxShadow='xl'
			display='flex'
			justifyContent='center'
			alignItems='center'
			w='100%'
			maxW='700px'
			mx='auto'
			mt={6}
		>
			<canvas
				ref={canvasRef}
				width={600}
				height={200}
				style={{
					width: '100%',
					height: 'auto',
					borderRadius: '16px',
					backgroundColor: 'transparent',
				}}
			/>
		</Box>
	);
};

export default AudioWaveVisualizer;
