import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/ui-store';
import AboutContent from '@/components/AboutContent';

export default function AboutModal() {
	const aboutOpen = useUIStore((s) => s.aboutOpen);
	const closeAbout = useUIStore((s) => s.closeAbout);

	return (
		<Modal
			isOpen={aboutOpen}
			onClose={closeAbout}
			title="About QWERMap"
			className="max-w-3xl"
		>
			<AboutContent />
		</Modal>
	);
}
