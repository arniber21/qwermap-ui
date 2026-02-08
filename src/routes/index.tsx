import { createFileRoute } from '@tanstack/react-router';
import Header from '@/components/Header';
import MapCanvas from '@/components/MapCanvas';
import FAB from '@/components/FAB';
import SafetyLegend from '@/components/SafetyLegend';
import LeftDockPanel from '@/components/LeftDockPanel';
import RightTopPanel from '@/components/RightTopPanel';
import AboutModal from '@/components/AboutModal';
import MobileDrawer from '@/components/MobileDrawer';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="relative h-screen w-screen overflow-hidden">
			<Header />
			<MapCanvas />
			<LeftDockPanel />
			<RightTopPanel />
			<MobileDrawer />
			<FAB />
			<SafetyLegend />
			<AboutModal />
		</div>
	);
}
