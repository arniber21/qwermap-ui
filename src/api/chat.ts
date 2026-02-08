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
	exploreMovement,
	findFigures,
	browseTimeline,
	filterByCommunity,
} from '@/lib/chat-tools';

const SYSTEM_PROMPT = `You are QWERMap Assistant — a knowledgeable, warm guide to LGBTQ+ places and history across Los Angeles, San Francisco, New York City, and Miami.

You help users explore the map, discover places, learn about queer history, and understand the movements, people, and events that shaped these communities.

## Tool usage
- **flyToPlace**: Fly the map to a specific place by name.
- **searchPlaces**: Search/filter places by category, type, keyword, or city.
- **getPlaceDetails**: Get full details about a place including events, figures, and tags.
- **exploreMovement**: Find all places connected to a movement (e.g. "stonewall", "aids_activism", "trans_rights").
- **findFigures**: Search for historical figures across all places (e.g. "Marsha P. Johnson", "Harvey Milk").
- **browseTimeline**: Show events in a year range (e.g. 1960–1975) to explore what happened when.
- **filterByCommunity**: Find places tagged with a community (e.g. "lesbian", "trans", "bipoc_queer").
- **toggleSafetyHeatmap**: Show or hide the safety heatmap.
- **zoomIn / zoomOut**: Adjust map zoom.

## Personality
- Be concise and friendly. Use 1-2 sentences unless the user asks for more.
- When discussing historical events, be respectful and educational.
- Mention specific figures, dates, and movements when relevant — the data is rich, use it.
- If a user asks about a city, search within that city. If they don't specify, search all cities.`;


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
			'Fly the map camera to a specific LGBTQ+ place in LA, SF, NYC, or Miami',
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
			'Search and filter LGBTQ+ places by category, type, keyword, or city',
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
			city: z
				.enum(['la', 'sf', 'nyc', 'miami'])
				.optional()
				.describe('City to search within'),
		}),
		execute: async (params: {
			query?: string;
			category?: string;
			type?: string;
			city?: string;
		}) => searchPlaces(params),
	}),
	getPlaceDetails: tool({
		description:
			'Get detailed information about a place including events, figures, movements, and community tags',
		inputSchema: z.object({
			name: z
				.string()
				.describe('Name of the place to get details for'),
		}),
		execute: async ({ name }: { name: string }) => getPlaceDetails(name),
	}),
	exploreMovement: tool({
		description:
			'Find all places connected to a specific LGBTQ+ movement (e.g. stonewall, aids_activism, trans_rights, gay_liberation, marriage_equality, pride, drag_culture, ballroom_culture, homophile_movement)',
		inputSchema: z.object({
			movement: z
				.string()
				.describe('Movement identifier (e.g. "stonewall", "aids_activism", "trans_rights")'),
		}),
		execute: async ({ movement }: { movement: string }) =>
			exploreMovement(movement),
	}),
	findFigures: tool({
		description:
			'Search for historical figures connected to LGBTQ+ places (e.g. Marsha P. Johnson, Harvey Milk)',
		inputSchema: z.object({
			query: z
				.string()
				.describe('Name or partial name of a historical figure'),
		}),
		execute: async ({ query }: { query: string }) => findFigures(query),
	}),
	browseTimeline: tool({
		description:
			'Find historical events that occurred within a year range across all places',
		inputSchema: z.object({
			startYear: z
				.number()
				.describe('Start year (e.g. 1960)'),
			endYear: z
				.number()
				.describe('End year (e.g. 1975)'),
		}),
		execute: async ({ startYear, endYear }: { startYear: number; endYear: number }) =>
			browseTimeline(startYear, endYear),
	}),
	filterByCommunity: tool({
		description:
			'Find places tagged with a specific community (e.g. lesbian, trans, bipoc_queer, drag, leather, two_spirit)',
		inputSchema: z.object({
			tag: z
				.string()
				.describe('Community tag (e.g. "lesbian", "trans", "bipoc_queer")'),
		}),
		execute: async ({ tag }: { tag: string }) => filterByCommunity(tag),
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
