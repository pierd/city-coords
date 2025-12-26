# City Coords

A geography guessing game where you identify capital cities from their coordinates.

## How to Play

1. You'll be shown latitude and longitude coordinates of a capital city
2. Type the city name in the search box - fuzzy search helps with typos
3. Select the correct city from the suggestions
4. Score points for correct answers across 10 rounds

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

The app is configured for GitHub Pages deployment at `city-coords.lessismore.studio`.

Push to `main` branch to trigger automatic deployment via GitHub Actions.

## Tech Stack

- React 19 + TypeScript
- Vite
- Fuse.js (fuzzy search)
- CSS (custom styling, no framework)
