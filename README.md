# QWERMap UI (subrepo)

## Stack
- React 19 + Vite 7
- TanStack Router
- Zustand for client state
- Mapbox GL JS
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Vitest

## Requirements
- Node/Bun: use Bun (this repo uses Bun scripts).
- Env vars:
  - `VITE_MAPBOX_TOKEN` for Mapbox tiles

## Development
```bash
bun install
bun run dev
```

## Build
```bash
bun run build
```

## Test
```bash
bun run test
```

## Key Structure
- `src/routes`: file-based routes (TanStack Router)
- `src/components`: UI + map panels
- `src/hooks`: Mapbox + data hooks
- `src/store`: Zustand stores
- `src/api`: client API adapters
- `src/styles.css`: design tokens + global styles

## Notes
- Mapbox instance is created in `src/hooks/useMapbox.ts`.
- UI state (panels, about modal) lives in `src/store/ui-store.ts`.
