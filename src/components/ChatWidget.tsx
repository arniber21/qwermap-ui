import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat-store';
import { useSearchStore } from '@/store/search-store';
import { sendChatMessage } from '@/api/chat';
import type { SimpleChatMessage } from '@/api/chat';
import { cn } from '@/lib/utils';

interface DisplayMessage {
	id: string;
	role: 'user' | 'assistant' | 'tool';
	content: string;
	toolName?: string;
}

let msgCounter = 0;
function nextId() {
	return `msg-${++msgCounter}`;
}

export default function ChatWidget() {
	const { isOpen, toggleChat } = useChatStore();
	const searchOpen = useSearchStore((s) => s.isOpen);
	const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
		{
			id: 'welcome',
			role: 'assistant',
			content:
				"Hi! I'm your QWERMap guide. Ask me to find places, show the safety map, or explore LGBTQ+ history in LA.",
		},
	]);
	const [chatHistory, setChatHistory] = useState<SimpleChatMessage[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-scroll to bottom
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [displayMessages]);

	// Focus input when opening
	useEffect(() => {
		if (isOpen) {
			requestAnimationFrame(() => inputRef.current?.focus());
		}
	}, [isOpen]);

	const handleSend = useCallback(async () => {
		const text = input.trim();
		if (!text || loading) return;

		setInput('');
		setLoading(true);

		// Add user message to both display and history
		const userDisplayMsg: DisplayMessage = {
			id: nextId(),
			role: 'user',
			content: text,
		};
		setDisplayMessages((prev) => [...prev, userDisplayMsg]);

		const newHistory: SimpleChatMessage[] = [
			...chatHistory,
			{ role: 'user', content: text },
		];
		setChatHistory(newHistory);

		try {
			const result = await sendChatMessage(newHistory);

			if (result.error) {
				setDisplayMessages((prev) => [
					...prev,
					{
						id: nextId(),
						role: 'assistant',
						content: result.error!,
					},
				]);
				setLoading(false);
				return;
			}

			// Show tool calls
			for (const tool of result.toolsUsed) {
				setDisplayMessages((prev) => [
					...prev,
					{
						id: nextId(),
						role: 'tool',
						content: tool.result,
						toolName: tool.name,
					},
				]);
			}

			// Show assistant response
			if (result.text) {
				setDisplayMessages((prev) => [
					...prev,
					{
						id: nextId(),
						role: 'assistant',
						content: result.text,
					},
				]);
				setChatHistory((prev) => [
					...prev,
					{ role: 'assistant', content: result.text },
				]);
			}
		} catch {
			setDisplayMessages((prev) => [
				...prev,
				{
					id: nextId(),
					role: 'assistant',
					content: 'Something went wrong. Please try again.',
				},
			]);
		} finally {
			setLoading(false);
		}
	}, [input, loading, chatHistory]);

	return (
		<>
			{/* Toggle button */}
			<motion.button
				onClick={toggleChat}
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className={cn(
					'fixed bottom-6 z-30 w-14 h-14 rounded-full',
					searchOpen
						? 'left-6 lg:left-[calc(20rem+1.5rem)]'
						: 'left-6',
					'flex items-center justify-center shadow-lg cursor-pointer',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mauve',
					isOpen ? 'bg-text-primary text-white' : 'text-white'
				)}
				style={
					isOpen
						? undefined
						: {
								background:
									'linear-gradient(135deg, #957DAD, #C3AED6)',
							}
				}
				aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
			>
				{isOpen ? <X size={22} /> : <MessageCircle size={22} />}
			</motion.button>

			{/* Chat window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
						}}
						className={cn(
							'fixed bottom-24 z-40 w-96 h-[520px] max-h-[70vh]',
							'bg-surface-elevated/90 backdrop-blur-md rounded-3xl shadow-xl border border-border',
							'flex flex-col overflow-hidden',
							searchOpen
								? 'left-6 lg:left-[calc(20rem+1.5rem)]'
								: 'left-6'
						)}
					>
						{/* Header */}
						<div className="px-4 py-3 border-b border-border bg-surface-elevated flex items-center gap-2">
							<div
								className="w-8 h-8 rounded-full flex items-center justify-center text-white"
								style={{
									background:
										'linear-gradient(135deg, #957DAD, #C3AED6)',
								}}
							>
								<MessageCircle size={14} />
							</div>
							<div>
								<p className="text-sm font-serif font-semibold text-text-primary">
									QWERMap Guide
								</p>
								<p className="text-[10px] text-text-muted">
									Powered by Gemini
								</p>
							</div>
						</div>

						{/* Messages */}
						<div
							ref={scrollRef}
							className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
						>
							{displayMessages.map((msg) => {
								if (msg.role === 'tool') {
									return (
										<div
											key={msg.id}
											className="flex items-start gap-2 text-xs text-text-muted"
										>
											<Wrench
												size={12}
												className="mt-0.5 shrink-0"
											/>
											<span>
												<span className="font-medium">
													{msg.toolName}
												</span>
												: {msg.content}
											</span>
										</div>
									);
								}

								const isUser = msg.role === 'user';
								return (
									<div
										key={msg.id}
										className={cn(
											'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
											isUser
												? 'self-end text-white rounded-br-md'
												: 'self-start bg-cream-dark text-text-primary rounded-bl-md'
										)}
										style={
											isUser
												? {
														background:
															'linear-gradient(135deg, #957DAD, #a98bbf)',
													}
												: undefined
										}
									>
										{msg.content}
									</div>
								);
							})}
							{loading && (
								<div className="self-start flex items-center gap-2 text-text-muted text-sm px-3.5 py-2.5">
									<Loader2
										size={14}
										className="animate-spin"
									/>
									Thinking...
								</div>
							)}
						</div>

						{/* Input */}
						<div className="px-3 py-3 border-t border-border">
							<div className="flex items-center gap-2">
								<input
									ref={inputRef}
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSend();
										}
									}}
									placeholder="Ask about places..."
									disabled={loading}
									className="flex-1 px-3 py-2 rounded-xl bg-cream-dark border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mauve/40 disabled:opacity-60"
								/>
								<button
									onClick={handleSend}
									disabled={!input.trim() || loading}
									className={cn(
										'p-2 rounded-xl transition-all cursor-pointer',
										'disabled:opacity-40 disabled:cursor-default',
										'text-white'
									)}
									style={{
										background:
											input.trim() && !loading
												? 'linear-gradient(135deg, #957DAD, #C3AED6)'
												: '#9490A0',
									}}
									aria-label="Send message"
								>
									<Send size={16} />
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
