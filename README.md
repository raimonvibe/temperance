# Temperance

**Live site: [temperance-lake.vercel.app](https://temperance-lake.vercel.app/)**

[![A white Bible with a cross on the cover beside an open book reading: Knowledge, Self-control, Perseverance, Godliness](public/temperance.jpg)](https://temperance-lake.vercel.app/)

> “and in knowledge, self-control; and in self-control, perseverance; and in perseverance, godliness.”
> — 2 Peter 1:6

## About

Temperance is a small devotional website about self-control. It takes eight everyday self-management skills (often called executive functions) and pairs each with a short reflection and a few Bible verses:

1. Flexible thinking
2. Working memory
3. Self-monitoring
4. Planning and prioritizing
5. Task initiation
6. Organization
7. Impulse control
8. Emotional control

The idea is simple: read one discipline, take the verses with you into the day, and come back tomorrow.

## Features

- **Verse for today**: the same verse for everyone all day, with a new one each day. You can copy it or show another verse.
- **Eight disciplines**: each one has notes and verses, a copy button for every verse, and a direct link you can share.
- **Search**: filter the disciplines and verses by any word.
- **Practice tracker**: mark the disciplines you practiced today and keep a streak of days in a row. It's stored in your browser only, with no account.
- **Light and dark theme**: follows your system setting and remembers your choice.
- **Installable**: comes with a web manifest and home-screen icons, plus share images for social links.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) with React 19 and TypeScript
- [lucide-react](https://lucide.dev/) icons
- Google Fonts through `next/font` (Cormorant Garamond, EB Garamond, Cinzel)
- Hosted on [Vercel](https://vercel.com/)

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to the live domain so the share images use absolute URLs. On Vercel, the production domain is picked up automatically.

## Project structure

```
src/
  app/          layout, homepage, icons, share images, manifest
  components/   Header, DailyVerse, Disciplines, Footer, ...
  data/         content.ts: the disciplines, notes and verses
  lib/          hooks for copying and the practice log
public/         hero image and home-screen icons
```

To change the text or verses, edit `src/data/content.ts`.
