import { generateText, tool, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import {
	flyToPlace,
	zoomIn,
	zoomOut,
	toggleSafetyHeatmap,
	searchPlaces,
	getPlaceDetails,
} from '@/lib/chat-tools';

const SYSTEM_PROMPT = `You are QWERMap Assistant — a helpful, warm guide to LGBTQ+ places in Los Angeles.
You can help users explore the map, find places, and learn about LGBTQ+ history.

When users ask to go to a place, use the flyToPlace tool.
When users ask about the safety heatmap, use the toggleSafetyHeatmap tool.
When users want to search/filter, use the searchPlaces tool.
When users ask for details about a specific place, use the getPlaceDetails tool.
When users ask to zoom in or out, use the zoomIn or zoomOut tools.

Keep responses concise and friendly. Use 1-2 sentences unless the user asks for more detail.`;

export interface SimpleChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

export interface ChatResult {
	text: string;
	toolsUsed: Array<{ name: string; result: string }>;
	error?: string;
}

const chatTools = {
	flyToPlace: tool({
		description:
			'Fly the map camera to a specific LGBTQ+ place in Los Angeles',
		inputSchema: z.object({
			name: z.string().describe('Name or partial name of the place'),
		}),
		execute: async ({ name }: { name: string }) => flyToPlace(name),
	}),
	zoomIn: tool({
		description: 'Zoom the map in closer',
		inputSchema: z.object({}),
		execute: async () => zoomIn(),
	}),
	zoomOut: tool({
		description: 'Zoom the map out to see more area',
		inputSchema: z.object({}),
		execute: async () => zoomOut(),
	}),
	toggleSafetyHeatmap: tool({
		description:
			'Show or hide the safety score heatmap layer on the map',
		inputSchema: z.object({
			show: z
				.boolean()
				.describe('Whether to show (true) or hide (false) the heatmap'),
		}),
		execute: async ({ show }: { show: boolean }) =>
			toggleSafetyHeatmap(show),
	}),
	searchPlaces: tool({
		description:
			'Search and filter LGBTQ+ places by category, type, or keyword',
		inputSchema: z.object({
			query: z
				.string()
				.optional()
				.describe('Text to search for in place names/descriptions'),
			category: z
				.enum([
					'bar',
					'cafe',
					'library',
					'community_center',
					'bookstore',
					'park',
					'art_space',
					'other',
				])
				.optional()
				.describe('Category to filter by'),
			type: z
				.enum(['current', 'historical'])
				.optional()
				.describe('Place type filter'),
		}),
		execute: async (params: {
			query?: string;
			category?: string;
			type?: string;
		}) => searchPlaces(params),
	}),
	getPlaceDetails: tool({
		description: 'Get detailed information about a specific place',
		inputSchema: z.object({
			name: z
				.string()
				.describe('Name of the place to get details for'),
		}),
		execute: async ({ name }: { name: string }) => getPlaceDetails(name),
	}),
};

export async function sendChatMessage(
	messages: SimpleChatMessage[]
): Promise<ChatResult> {
	const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY as
		| string
		| undefined;
	if (!apiKey) {
		return {
			text: '',
			toolsUsed: [],
			error: 'Set VITE_GOOGLE_GENERATIVE_AI_API_KEY in .env.local to enable the chatbot.',
		};
	}

	try {
		const googleProvider = createGoogleGenerativeAI({ apiKey });

		const result = await generateText({
			model: googleProvider('gemini-2.0-flash'),
			system: SYSTEM_PROMPT,
			messages: messages.map((m) => ({
				role: m.role as 'user' | 'assistant',
				content: m.content,
			})),
			tools: chatTools,
			stopWhen: stepCountIs(3),
		});

		// Collect tool results from steps
		const toolsUsed: Array<{ name: string; result: string }> = [];
		for (const step of result.steps) {
			for (const tc of step.toolCalls) {
				const tr = step.toolResults.find(
					(r) => r.toolCallId === tc.toolCallId
				);
				toolsUsed.push({
					name: tc.toolName,
					result: tr ? String(tr.output) : '',
				});
			}
		}

		return {
			text: result.text,
			toolsUsed,
		};
	} catch (e) {
		console.error('Chat error:', e);
		return {
			text: '',
			toolsUsed: [],
			error: 'Something went wrong. Please try again.',
		};
	}
}
