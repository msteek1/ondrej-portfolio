# Ondrej Zuscik — Portfolio

A single-page, scroll-driven cinematic portfolio. Two scroll-scrubbed image-sequence
scenes pull you from a desk into an AI world and across a new frontier, then unfold a
short CV: manifesto, expertise, career timeline, projects and contact.

**Live:** _(add your Vercel URL here)_

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- GSAP (ScrollTrigger) + Framer Motion (`motion`)
- Lenis (smooth scroll)
- lucide-react

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Notes

- Hero/intro frames live in `public/frames/` (WebP image sequences). To swap the hero
  video, re-export it to a frame sequence, convert to WebP, drop the files in, and adjust
  `N1` / `N2` in `src/components/IntroScrub.tsx`.
- All copy/content is in `src/data.ts`.
- Add `?still=1` to the URL to force final (reduced-motion) states for static review.

## Deploy (Vercel)

Import the repo on Vercel — framework is auto-detected as **Vite** (build `npm run build`,
output `dist`). The production `*.vercel.app` URL is public by default.
