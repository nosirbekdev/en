import { ColorModeProvider } from '@/components/ui/color-mode';
import { Provider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { HydrationProvider } from 'react-hydration-provider';
import ContentWrapper from './components/layout/content-wrapper';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'En - Admin Panel',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<HydrationProvider>
					<ColorModeProvider>
						<Provider>
							<ContentWrapper>{children}</ContentWrapper>
							<Toaster />
						</Provider>
					</ColorModeProvider>
				</HydrationProvider>
			</body>
		</html>
	);
}
