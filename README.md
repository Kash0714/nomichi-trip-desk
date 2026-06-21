# Nomichi Trip Desk

A mini-CRM and public enquiry tool for the Nomichi team. Built with Next.js 14 (App Router), Supabase, and Tailwind.

**Live URL:** [your-vercel-url.vercel.app]  
**Admin login:** Create an account at `/login` using "Create account." No invite required.

---

## What this is

A real end-to-end tool: a traveller submits an enquiry on the public page, it lands live in the admin panel, and the team can move it through a pipeline, log every conversation, assign an owner, and get an AI vibe read — all without touching a spreadsheet.

Three connected pieces:

**Public page** — Shows open trips. A traveller clicks "Send an enquiry," fills in a form, and submits. The lead appears immediately in admin.

**Admin CRM** — Lead list with search and filters (by status, trip, owner). Lead detail view with the full pipeline, a timestamped call log, and owner assignment.

**Trips CMS** — The team creates and edits trips directly in admin. Setting a trip to "open" makes it appear on the public page. Closing it removes it.

**Dashboard** — Total leads, breakdown by pipeline stage, and leads per trip. One screen, no charts, just the numbers a team lead needs each morning.

**AI vibe read** — On any lead detail view, press "Get AI read." Claude reads the traveller's group type, preferred month, and vibe text against the trip description, and returns a soft fit signal: likely, maybe, or unclear, with one sentence of reasoning. It is stored against the lead and can be re-run. It is never automatic and never a hard reject.

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres, Auth, Row-Level Security)
- **Tailwind CSS** with Nomichi brand tokens
- **Anthropic claude-sonnet-4-6** for the vibe-check feature (server-side only)
- **Vercel** for deployment

---

## Local setup

**1. Clone and install**
```bash
git clone https://github.com/your-username/nomichi-trip-desk
cd nomichi-trip-desk
npm install
```

**2. Create a Supabase project**

Go to [supabase.com](https://supabase.com), create a new project, then:

- Open the SQL editor and run `supabase/migrations/001_initial.sql` — this creates all tables, RLS policies, and the profile-creation trigger.
- Then run `supabase/seed.sql` — this adds four sample trips and five sample leads.

**3. Set environment variables**
```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from the same page
- `ANTHROPIC_API_KEY` — from console.anthropic.com (never prefix this with NEXT_PUBLIC_)

**4. Run**
```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

**5. Create your admin account**

Go to [localhost:3000/login](http://localhost:3000/login), click "New to the team? Create an account," and sign up. Supabase will send a confirmation email.

---

## Deploying to Vercel

```bash
vercel --prod
```

Add the same three environment variables under Vercel's project settings. The live URL is what you submit.

---

## Three decisions I'm most proud of

**1. "Get AI read" is a button, not a trigger.**  
I deliberately made the vibe check something the team explicitly asks for, not something that runs automatically on enquiry submission. This keeps the public form fast (no latency waiting on an AI call), keeps a human in the loop on when AI judgment gets involved, and matches the brief's note that it should be "a suggestion only, never an automatic reject." The result is stored against the lead so it persists across page loads and does not need to re-run on every visit.

**2. Four tables, no more.**  
`profiles`, `trips`, `leads`, `touchpoints`. The touchpoints table is intentionally append-only — you cannot edit or delete a note. This is a deliberate product call: a call log is a record, not a draft. The `profiles` table mirrors `auth.users` and carries a `role` field (`associate` / `manager`), which makes Row-Level Security for owner-scoped access straightforward to add later without touching the schema.

**3. Trip status is the connection between CMS and public page.**  
Setting a trip to `closed` in admin immediately removes it from the public enquiry page with no cache delay. The public page has `export const revalidate = 60` set to ISR for performance, but because the Supabase query filters by `status = 'open'`, a closed trip disappears within one minute at most. This is the wiring the brief called out as the part that makes it real.

---

## What I would do with another week

- **Supabase Realtime on the lead list** — so a new enquiry lights up in the admin panel without a refresh, instead of the current "leads appear on page load."
- **Row-level security by owner** — the `role` column is already there; wiring up RLS so associates only see their assigned leads is a small policy change.
- **CSV export** — a single server route that runs the same filtered query as the lead list and streams a CSV back.
- **WhatsApp message drafter** — the second AI feature from the brief. Given the trip details and the traveller's vibe text, draft a warm, short first message in Nomichi's voice.
- **Activity timeline** — a unified per-lead log showing status changes, owner changes, and touchpoints in chronological order, rather than touchpoints alone.

---

*Nomichi Explorers Private Limited · thenomichi.com · @thenomichi*
