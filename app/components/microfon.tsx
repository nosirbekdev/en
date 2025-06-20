'use client';

import { toaster } from '@/components/ui/toaster';
import { PronunciationService } from '@/services/pronun';
import { Box, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaPlayCircle, FaStopCircle } from 'react-icons/fa';

const MotionBox = motion(Box);

interface MicrophoneButtonProps {
	practiceText: string;
	onResult: (result: any) => void;
}

const MicrophoneButton = ({ practiceText, onResult }: MicrophoneButtonProps) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunks = useRef<Blob[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		navigator.permissions
			?.query({ name: 'microphone' as PermissionName })
			.then(result => setHasPermission(result.state === 'granted'))
			.catch(() => setHasPermission(null));
	}, []);

	const requestMicrophoneAccess = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			setHasPermission(true);

			const recorder = new MediaRecorder(stream);
			audioChunks.current = [];

			recorder.ondataavailable = event => {
				audioChunks.current.push(event.data);
			};

			recorder.onstop = async () => {
				const blob = new Blob(audioChunks.current, { type: 'audio/webm' });

				// ✅ Blobni File ga aylantirish
				const file = new File([blob], 'recording.webm', {
					type: 'audio/webm',
					lastModified: Date.now(),
				});

				// 📨 APIga yuborish
				try {
					const result = await PronunciationService.pronunCreateUser({
						audio: file,
						text: practiceText,
					});
					console.log(result);
					onResult(result);
					toaster.success({
						title: 'Audio uploaded!',
						description: 'Your pronunciation has been saved.',
					});
				} catch (err) {
					toaster.error({
						title: 'Upload failed',
						description: String(err),
					});
				}
				const url = URL.createObjectURL(blob);
				setAudioURL(url);
			};

			mediaRecorderRef.current = recorder;
			recorder.start();
			setIsRecording(true);
		} catch (err) {
			console.error('Permission error:', err);
			toaster.error({
				title: 'Microphone Access Denied',
				description: 'Enable microphone access to continue.',
			});
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		setIsRecording(false);
	};

	const toggleAudioPlayback = () => {
		if (!audioURL) return;

		if (!audioRef.current) {
			audioRef.current = new Audio(audioURL);
		}

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
			audioRef.current.onended = () => setIsPlaying(false);
		}
	};

	return (
		<Box textAlign='center'>
			<Box
				position='relative'
				w='120px'
				h='120px'
				mx='auto'
				display='flex'
				justifyContent='center'
				alignItems='center'
				cursor='pointer'
				onClick={isRecording ? stopRecording : requestMicrophoneAccess}
			>
				<MotionBox
					position='absolute'
					top={0}
					left={0}
					w='120px'
					h='120px'
					borderRadius='full'
					bg='linear-gradient(to right, #C30EFF, #1E92FF)'
					animate={{
						scale: [1, 1.5],
						opacity: [0.5, 0],
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: 'easeOut',
					}}
				/>

				<Box
					as='button'
					bg='linear-gradient(to right, #C30EFF, #1E92FF)'
					borderRadius='full'
					w='100px'
					h='100px'
					display='flex'
					justifyContent='center'
					alignItems='center'
					boxShadow='lg'
					zIndex={1}
				>
					{isRecording ? (
						<FaStopCircle size={40} color='white' />
					) : (
						<FaMicrophone size={40} color='white' />
					)}
				</Box>
			</Box>

			{audioURL && (
				<Button mt={4} onClick={toggleAudioPlayback} colorScheme='purple' variant='outline'>
					{isPlaying ? <FaStopCircle size={20} /> : <FaPlayCircle size={20} />}
					{isPlaying ? 'Stop playback' : 'Listen to your voice'}
				</Button>
			)}
		</Box>
	);
};

export default MicrophoneButton;
