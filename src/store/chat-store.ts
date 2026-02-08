import { create } from 'zustand';

interface ChatState {
	isOpen: boolean;
	toggleChat: () => void;
	openChat: () => void;
	closeChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
	isOpen: true,
	toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
	openChat: () => set({ isOpen: true }),
	closeChat: () => set({ isOpen: false }),
}));
