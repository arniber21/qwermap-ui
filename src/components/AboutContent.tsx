import { Heart, Shield, Globe } from 'lucide-react';

export default function AboutContent() {
	return (
		<div className="flex flex-col gap-6 text-text-secondary leading-relaxed">
			<p>
				QWERMap is an interactive map for discovering and preserving LGBTQ+
				third places — bars, cafes, libraries, community centers, and
				historical sites that serve as vital gathering spaces for queer
				communities.
			</p>

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="p-4 rounded-xl bg-surface-elevated border border-border">
					<Heart size={20} className="text-rose mb-2" />
					<h3 className="font-serif font-semibold text-text-primary mb-1">
						Community-Powered
					</h3>
					<p className="text-sm">
						Anyone can submit a place. Upvotes from the community verify safety
						and accuracy.
					</p>
				</div>
				<div className="p-4 rounded-xl bg-surface-elevated border border-border">
					<Shield size={20} className="text-mauve mb-2" />
					<h3 className="font-serif font-semibold text-text-primary mb-1">
						Blockchain-Backed
					</h3>
					<p className="text-sm">
						Every submission is recorded on Solana for transparency and
						tamper-proof preservation.
					</p>
				</div>
				<div className="p-4 rounded-xl bg-surface-elevated border border-border">
					<Globe size={20} className="text-sky mb-2" />
					<h3 className="font-serif font-semibold text-text-primary mb-1">
						Historical Memory
					</h3>
					<p className="text-sm">
						Preserving sites of significance — from the Cooper Do-nuts Riot to
						today's vibrant spaces.
					</p>
				</div>
			</div>

			<p>
				Third places are spaces beyond home and work where community forms
				organically. For LGBTQ+ people, these spaces have been — and remain —
				essential for safety, belonging, and cultural expression.
			</p>

			<p className="text-sm text-text-muted border-t border-border pt-4">
				Built with care during a hackathon. QWERMap is open-source and
				community-driven.
			</p>
		</div>
	);
}
