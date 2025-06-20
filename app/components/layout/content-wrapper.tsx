'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { usePathname } from 'next/navigation';
import { Client } from 'react-hydration-provider';

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDashboard = pathname.startsWith('/instructor'); // yoki '/dashboard', '/admin', va h.k.

	if (isDashboard) {
		return <>{children}</>;
	}

	return (
		<>
			<Header />
			<main style={{ flex: 1, padding: '1rem 2rem' }}>
				<Client>{children}</Client>
			</main>
			<Footer />
		</>
	);
}
