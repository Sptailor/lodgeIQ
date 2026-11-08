# LodgeIQ

LodgeIQ gives tour operators one inspection standard for every lodge, camp and hotel they sell. Inspectors score a property on their phone, and the operations team sees the whole portfolio, the follow ups and the trends in one place.

## Stack

- Next.js 14 (app router) and React 18
- Tailwind CSS with a scoped stylesheet for the app and one for the landing page
- Prisma with Postgres (Neon)
- Auth.js v5 (NextAuth) with JWT sessions: demo sign in, optional email link and Google
- Vercel Blob for inspection photos
- Geist for type, Phosphor for icons
- `jspdf` and `jspdf-autotable` for the PDF report

## Local setup

1. Install packages with `npm install`.
2. Create `.env` with these variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `CRON_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
   - optional: `AUTH_RESEND_KEY` (email sign in), `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (Google sign in, both needed)
3. Create the tables and load the sample portfolio:

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Start the app with `npm run dev`.

## How the demo works

`/demo` signs in the demo account (an operations manager) and opens the app with 20 sample properties. It is a sandbox: everything works, but changes are kept only in that browser tab and never reach the database. The server also refuses writes from the demo account. A nightly job (`/api/cron/reseed-demo`, scheduled in `vercel.json` and protected by `CRON_SECRET`) resets the sample data to its starting state.

Real accounts save inspections, follow ups and visits through the API routes under `app/api`.

## Photo credits

All photos are from Unsplash, by Rafael Peier, Pew Nguyen, Marie Dehayes, Shaain Ibrahim, Ben Kupke, Puscas Adryan, Jasmeet Singh, A, Ahmed Galal, Marc Wieland, Aalo Lens, Josh Hild, Andy Wang, Dave Photoz, Olga Serjantu, Mirko Meister, Harman Tatla and Zeng Yili. The properties, people and scores shown are samples.

## Globe data

The globe uses country shapes from Natural Earth through the `world-atlas` package (ISC licence).
