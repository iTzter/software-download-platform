# Software Download Portal (Next.js + Supabase)

A fresh, production-ready starter for a **Software Download Portal** with a modern dark UI, Supabase Auth, Storage uploads, and an admin dashboard.

## Full Folder Structure

```text
.
├─ app/
│  ├─ (site)/
│  │  ├─ category/[slug]/page.tsx
│  │  ├─ software/[id]/page.tsx
│  │  └─ page.tsx
│  ├─ admin/
│  │  ├─ (dashboard)/
│  │  │  ├─ categories/page.tsx
│  │  │  └─ software/page.tsx
│  │  └─ login/page.tsx
│  ├─ api/revalidate/route.ts
│  ├─ globals.css
│  └─ layout.tsx
├─ components/
│  ├─ admin/
│  │  ├─ software-form.tsx
│  │  ├─ stats-cards.tsx
│  │  └─ visibility-toggle.tsx
│  ├─ home/
│  │  ├─ featured-slider.tsx
│  │  ├─ hero-section.tsx
│  │  └─ latest-grid.tsx
│  └─ ui/
│     ├─ button.tsx
│     └─ input.tsx
├─ lib/
│  ├─ actions/admin.ts
│  ├─ supabase/client.ts
│  ├─ supabase/server.ts
│  └─ utils.ts
├─ supabase/schema.sql
├─ types/database.ts
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

## Supabase SQL Schema

Run the full SQL in:

- `supabase/schema.sql`

This includes:
- `categories` and `software` tables exactly as requested.
- `admin_users` mapping table for role checks.
- RLS policies so public users can read and only admins can write.
- Storage bucket setup for `files` and `images` + policies.

## Core Upload Logic (Server Action)

Main implementation is in:

- `lib/actions/admin.ts`

`uploadSoftwareAction` workflow:
1. Validates input with `zod`.
2. Uploads binary file to Supabase bucket `files`.
3. Uploads thumbnail image to Supabase bucket `images`.
4. Retrieves public URLs from storage.
5. Inserts final software row into `software` table.
6. Revalidates homepage and admin list pages.

## Main UI Components

### Homepage
- `components/home/hero-section.tsx` → Hero + search bar.
- `components/home/featured-slider.tsx` → Featured software cards.
- `components/home/latest-grid.tsx` → Latest software grid.
- Used in `app/(site)/page.tsx`.

### Admin Dashboard
- `components/admin/software-form.tsx` → Upload form + featured/hidden toggles.
- `components/admin/visibility-toggle.tsx` → instant hide/show switch.
- `components/admin/stats-cards.tsx` → total downloads and software count.
- Used in `app/admin/(dashboard)/software/page.tsx`.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Development

```bash
npm install
npm run dev
```
