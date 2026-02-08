import { createFileRoute } from '@tanstack/react-router';
import Header from '@/components/Header';
import MapCanvas from '@/components/MapCanvas';
import PlaceDetailsPanel from '@/components/PlaceDetailsPanel';
import FAB from '@/components/FAB';
import SubmitPlacePanel from '@/components/SubmitPlacePanel';
import SafetyLegend from '@/components/SafetyLegend';
import SearchFilterPanel from '@/components/SearchFilterPanel';
import FeaturedTab from '@/components/FeaturedTab';
import ChatWidget from '@/components/ChatWidget';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="relative h-screen w-screen overflow-hidden">
			<Header />
			<MapCanvas />
			<SearchFilterPanel />
			<FeaturedTab />
			<PlaceDetailsPanel />
			<FAB />
			<SubmitPlacePanel />
			<SafetyLegend />
			<ChatWidget />
		</div>
	);
}
