import InstructorMainContent from '../components/layout/instructor-layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <InstructorMainContent>{children}</InstructorMainContent>;
}
