import FeaturedTab from '@/components/FeaturedTab';
import ChatWidget from '@/components/ChatWidget';

export default function RightTopPanel() {
	return (
		<aside
			className="hidden lg:block fixed top-20 right-6 z-30 w-[24rem] max-w-full"
			aria-label="Featured places and chat"
		>
			<div className="bg-surface-elevated/90 backdrop-blur-md rounded-3xl shadow-xl border border-border overflow-hidden">
				<div className="px-2 pt-2">
					<FeaturedTab embedded hideWhenSelected={false} variant="bare" />
				</div>
				<div className="border-t border-border">
					<ChatWidget embedded variant="bare" className="h-[480px]" />
				</div>
			</div>
		</aside>
	);
}
