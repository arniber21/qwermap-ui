import { createFileRoute, Link } from '@tanstack/react-router'
import { MapPin, ArrowLeft, Heart, Shield, Globe } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface-elevated/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors text-text-muted hover:text-text-primary no-underline"
            aria-label="Back to map"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-mauve" />
            <span className="font-serif text-lg font-bold text-text-primary">
              QWERMap
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-text-primary mb-6">
          About QWERMap
        </h1>

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
                Anyone can submit a place. Upvotes from the community verify
                safety and accuracy.
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
                Preserving sites of significance — from the Cooper Do-nuts Riot
                to today's vibrant spaces.
              </p>
            </div>
          </div>

          <p>
            Third places are spaces beyond home and work where community forms
            organically. For LGBTQ+ people, these spaces have been — and remain
            — essential for safety, belonging, and cultural expression.
          </p>

          <p className="text-sm text-text-muted border-t border-border pt-4">
            Built with care during a hackathon. QWERMap is open-source and
            community-driven.
          </p>
        </div>
      </main>
    </div>
  )
}
