# VC Intelligence Interface

A production-quality frontend for a venture capital intelligence tool, built with a modern SaaS aesthetic.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Hooks + localStorage
- **Fonts**: Inter (Google Fonts)

## Features & Implementation

This application is strictly frontend-only, demonstrating complex state management, data visualization, and a premium UX without a backend.

- **Storage**: All persistence (Notes, Lists, Saved Searches, Enrichment Results) is handled purely in the browser via a type-safe `localStorage` wrapper (`src/lib/storage.ts`).
- **Mock Data**: The database is seeded securely with local mock datasets (`src/data/mockCompanies.ts`). No real data fetching or external API integrations are used.
- **Enrichment Simulation**: The "Enrich" action on a company profile simulates an asynchronous operation (1.5s delay) to show skeleton loading states, followed by caching the mocked result.
- **Dark Mode**: Top-level theme toggle that syncs with `localStorage` and falls back to system preferences.
- **Custom UI System**: Built from scratch using Tailwind CSS, including sortable tables, responsive sidebars, skeleton loaders, custom toasts, and modals.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note: uses standard `npm`)*

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Design Guidelines

The interface references a sleek fintech/VC tool aesthetic:
- **Light Theme**: #F8FAFC background, #FFFFFF surface, Indigo primary.
- **Dark Theme**: #0F172A background, #1E293B surface, soft slate accents.
- **Typography**: Clean, geometric layout using Inter, slight letter spacing on small headers.
- **Interaction**: Micro-animations on buttons, hover states on table rows, sliding toast notifications, and smoothly collapsing sidebars.

## Project Structure

- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable UI elements, layout wrappers, and page-specific feature components
- `/src/data/` - Mock datasets and data logic simulation
- `/src/lib/` - Utilities and custom hooks (localStorage wrapper, classname merging)
- `/src/types/` - TypeScript interface definitions
