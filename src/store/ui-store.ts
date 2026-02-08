import { create } from 'zustand';

type LeftPanelTab = 'search' | 'add';
type MobileDrawerTab = 'details' | 'search' | 'add' | 'chat' | 'featured';

interface UIState {
	leftPanelTab: LeftPanelTab;
	setLeftPanelTab: (tab: LeftPanelTab) => void;
	mobileDrawerOpen: boolean;
	mobileDrawerTab: MobileDrawerTab;
	setMobileDrawerOpen: (open: boolean) => void;
	setMobileDrawerTab: (tab: MobileDrawerTab) => void;
	aboutOpen: boolean;
	openAbout: () => void;
	closeAbout: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	leftPanelTab: 'search',
	setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
	mobileDrawerOpen: true,
	mobileDrawerTab: 'search',
	setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
	setMobileDrawerTab: (tab) => set({ mobileDrawerTab: tab }),
	aboutOpen: false,
	openAbout: () => set({ aboutOpen: true }),
	closeAbout: () => set({ aboutOpen: false }),
}));
