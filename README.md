# Software Download Portal (Next.js + Supabase)

A full rewrite using **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Full Folder Structure

```txt
.
├── actions
│   ├── category-actions.ts
│   └── software-actions.ts
├── app
│   ├── admin
│   │   ├── categories/page.tsx
│   │   ├── login/page.tsx
│   │   ├── software/page.tsx
│   │   └── page.tsx
│   ├── api/download/[id]/route.ts
│   ├── category/[slug]/page.tsx
│   ├── software/[id]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── admin/software-table.tsx
│   ├── home/featured-slider.tsx
│   ├── home/hero-section.tsx
│   ├── home/latest-grid.tsx
│   └── ui
│       ├── button.tsx
│       └── input.tsx
├── lib
│   ├── data.ts
│   ├── utils.ts
│   └── supabase
│       ├── client.ts
│       └── server.ts
├── sql/supabase-schema.sql
├── types/database.ts
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Run

1. `npm install`
2. Copy `.env.example` to `.env.local` and set values.
3. Execute SQL in `sql/supabase-schema.sql` on your Supabase project.
4. `npm run dev`

## Core Upload Logic (Supabase Storage)

The storage upload logic is implemented in `actions/software-actions.ts` in `uploadToStorage`:

- Receives uploaded `File`.
- Generates unique path with timestamp + UUID.
- Uploads to `files` or `images` bucket.
- Returns a public URL used in `software.download_url` / `thumbnail_url`.

## Main UI Components

- Homepage: `components/home/hero-section.tsx`, `featured-slider.tsx`, `latest-grid.tsx`.
- Admin Dashboard: `app/admin/page.tsx` + CRUD pages under `app/admin/software` and `app/admin/categories`.
- Software table toggles feature/hidden status instantly with server actions.
