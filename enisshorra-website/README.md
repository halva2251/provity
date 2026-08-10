# enisshorra.ch — Personal Website

Personal website for Enis Shorra, built with Next.js 16, TypeScript, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

The app will start on [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
enisshorra-website/
├── app/
│   ├── layout.tsx      ← Root layout
│   ├── page.tsx        ← Home page
│   └── globals.css     ← Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Customization

- Edit `app/page.tsx` to customize the home page
- Add new routes by creating files in the `app/` directory
- Modify Tailwind styles in `tailwind.config.ts`
