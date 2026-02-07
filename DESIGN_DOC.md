# QWERMap Frontend Design Doc

## Overview
Interactive map for LGBTQ+ third places (bars, cafes, libraries) and historical queer sites. Users anonymously submit/upvote via Solana blockchain. **Stack**: React, Mapbox GL JS, Solana Web3.js, Tailwind CSS.

## Core UI Components

**Map Canvas** (Mapbox)
- Two toggleable layers: "Current Places" (default on) / "Historical Sites" (sepia markers)
- Clustering at low zoom, expands on zoom in
- Different marker icons per category (bar/cafe/library/etc)
- Optional heat map overlay showing safety scores (red→yellow→green gradient)

**Place Details Panel** (slides from right on marker click)
- Name, category badge, era, description (300 char preview + expand)
- Photo carousel, address with directions link
- Safety score gauge (0-100), upvote button with count
- Solana tx link to explorer

**Filter Sidebar** (collapsible)
- Place type: Current/Historical/Both
- Category multi-select
- Era slider (historical only)
- Safety score range slider
- "Verified only" toggle (upvotes > 5)

**Search Bar** (top header)
- Geocoding autocomplete, flies to location on select

**Submit Place Modal** (triggered by "+" FAB or map right-click)
- Fields: name*, category*, place_type*, era (if historical), description (2000 char max), address, photos (5 URL inputs), additional_info (JSON or key-value)
- Draggable location pin on mini-map (pre-filled from click)
- Flow: Validate → POST /places → Show "Submitting to Solana..." → Success toast with tx link → Marker appears with "Pending" badge
- Banner: "Submissions are anonymous via blockchain"

## State Management (Zustand/Context)
```javascript
{
  mapCenter: {lat, lon},
  zoomLevel: number,
  filters: {placeType, categories[], eraRange, safetyScoreRange, verifiedOnly},
  selectedPlace: PlaceDetail | null,
  places: PlaceSummary[], // API cache
  layersVisible: {current, historical, safetyHeatmap},
  submissionModal: {isOpen, prefillLocation}
}
```

## Key Interactions

**Upvote**: Click button → Generate fingerprint (hash of userAgent + screen + timezone) → POST `/places/{id}/upvote` with `X-Client-Fingerprint` header → Optimistic UI update → Button shows "Upvoted" (disabled) on success, rollback on 409/error

**Map Query**: Debounced (300ms) on pan/zoom → GET `/places` with current bounds, filters → Cache by bounds hash → Render markers with Supercluster (max 100 unclustered)

**Safety Score**: GET `/safety-scores` for region → Render heatmap overlay with gradient → Legend fixed bottom-left

## Design System
**Typography**: Inter (headers/body), JetBrains Mono (tx IDs)

**Layout**: Header with logo/search/about → Main: filter sidebar (20%) + map canvas (80%) + details panel overlay → FAB bottom-right

**Accessibility**: WCAG AA contrast, keyboard nav for all interactions, ARIA labels ("Upvote {name}"), screen reader announcements for dynamic updates

## Technical Notes

- Marker clustering via Supercluster library
- Lazy load images in carousels
- API calls use fetch with error handling (toast for network errors, plain-English Solana errors)
- Geolocation fallback to LA if denied
- Form validation: inline errors, prevent submission until valid
- Service worker for offline map tiles (stretch)

## Mobile Adaptations
- Filters in bottom sheet modal (no sidebar)
- Details panel slides up from bottom (sheet style)
- Search floats over map
- Larger touch targets for FAB/markers
