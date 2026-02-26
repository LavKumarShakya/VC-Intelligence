# VC Intelligence

A structured discovery and enrichment interface for analyzing startup companies. Users can search, filter, and view company profiles, then trigger AI-driven enrichment that scrapes only the official company website and returns structured data.

This project is intentionally scoped as an MVP per assignment constraints.

---

## Project Overview

**Core Workflow:**

`Discover → Open Profile → Enrich → Analyze → Save`

- Browse a searchable, filterable, sortable company directory
- View individual company profiles with signals and notes
- Trigger live AI enrichment from the company's official website
- Organize companies into custom lists with JSON/CSV export
- Save and re-run search queries

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework, routing, SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Lucide React | Icon library |
| localStorage | Client-side persistence |

### Backend

| Technology | Purpose |
|---|---|
| Next.js API Routes | Serverless endpoint |
| Cheerio | HTML parsing and sanitization |
| `@google/genai` | Gemini 2.5 Flash LLM |
| Zod | Runtime schema validation |
| In-memory Map | Rate limiting and caching |

---

## Architecture

```
Frontend (React)
       │
       ▼
POST /api/enrich
       │
       ▼
Security Validation (SSRF + Rate Limit)
       │
       ▼
Cache Check ──── HIT ──→ Return cached JSON
       │
      MISS
       │
       ▼
Scraper (official website only)
       │
       ▼
LLM Structured Extraction (Gemini)
       │
       ▼
Runtime Validation (Zod)
       │
       ▼
Cache Store → Response → UI
```

**Expected Latency:**

- First-time enrichment: 4–10 seconds (LLM dependent)
- Cached enrichment: <100ms

---

## Enrichment Scope

The enrichment engine operates under strict, intentional scope control:

- Only the official website provided in the company record is scraped
- Paths attempted sequentially: `/`, `/about`, `/doc`, `/docs`, `/blog`, `/careers`
- Maximum 4 pages scraped per request
- Maximum 12,000 characters of text sent to the LLM
- No external feeds, no GitHub, no social media scraping
- No headless browser — direct HTTP fetch only

This is intentional MVP scope control, not an oversight.

---

## Source Transparency

The API returns a `sources` array documenting every attempted URL, whether it succeeded or failed.

```json
{
  "url": "https://example.com/about",
  "status": 404,
  "success": false,
  "timestamp": "2025-02-25T17:00:00.000Z"
}
```

| Field | Description |
|---|---|
| `url` | The exact URL that was fetched |
| `status` | HTTP status code returned (200, 404, 403, etc.) |
| `success` | `true` only if fetch succeeded AND extracted text exceeded 300 characters |
| `timestamp` | ISO timestamp of the fetch attempt |

**Key distinctions:**

- A page returning `200 OK` but containing less than 300 readable characters is marked `success: false` — it was fetched but not analytically useful
- Failed pages (404, 403, timeout) are recorded with their status code
- Only pages marked `success: true` contribute text to the LLM prompt

---

## Security

| Protection | Implementation |
|---|---|
| SSRF Prevention | Blocks private IPs (`10.x`, `192.168.x`, `127.0.0.1`, `169.254.169.254`, `::1`, cloud metadata endpoints) |
| Protocol Enforcement | Only `http:` and `https:` allowed |
| Redirect Policy | Same registrable domain only. Subdomains and `www` normalization allowed. HTTP→HTTPS upgrades allowed. Cross-domain redirects blocked. |
| API Key Isolation | `GEMINI_API_KEY` stays server-side only, never prefixed with `NEXT_PUBLIC_` |
| Output Sanitization | All LLM output passes through Zod schema validation before reaching the client |

---

## Rate Limiting

- In-memory rate limiter using a `Map<string, number[]>`
- **5 requests per minute per IP address**
- Instance-local (not distributed across serverless nodes)
- Resets on server restart

Suitable for MVP and demo environments. Production deployments would require a distributed store like Redis.

---

## Caching

- In-memory cache using a `Map<string, CacheEntry>`
- Keyed by normalized website URL
- TTL: **10 minutes**
- Reduces redundant LLM calls and improves response time for repeated requests

**Rate limiting is enforced before cache lookup.** Cached requests still consume one of the 5 allowed requests per minute. This is an intentional defense-in-depth decision.

---

## Error Handling

| Status Code | Meaning | Trigger |
|---|---|---|
| `400` | Invalid input | Malformed URL, missing company ID, or SSRF-blocked address |
| `429` | Rate limited | More than 5 requests per minute from the same IP |
| `500` | Internal failure | JSON parse error, Zod schema validation failure, or non-retriable LLM error |
| `502` | Upstream failure | LLM service unavailable after retry, or insufficient content (less than 300 readable characters extracted across all paths) |

**Retry logic:**

- A single retry with 500ms delay is attempted only on network timeouts or 5xx LLM errors
- No retries on 4xx errors, malformed JSON, or schema validation failures (these are deterministic)

---

## Environment Setup

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

This key is read server-side via `process.env.GEMINI_API_KEY`. It is never exposed to the browser. It is required for the `/api/enrich` endpoint to function.

---

## Local Development

```bash
npm install
npm run dev
```

Access the application at `http://localhost:3000`.

---

## Build Verification

```bash
npm run build
```

The production build compiles with zero TypeScript errors.

---

## Design Tradeoffs

| Decision | Reasoning |
|---|---|
| In-memory cache and rate limiter | Avoids external infrastructure (Redis) for MVP simplicity |
| No headless browser | Direct HTTP fetch is faster, lighter, and sufficient for static HTML sites |
| No distributed cache | Single-node architecture is adequate for the target scope |
| Synchronous enrichment | No background queue — the request holds the connection open while the LLM processes |
| LLM-based extraction | Dynamically interprets arbitrary website structures instead of relying on brittle, site-specific HTML selectors |
| localStorage for persistence | Avoids database setup overhead for an MVP demo |

---

## Known Limitations

- Cannot scrape JavaScript-heavy SPAs that do not render static HTML
- In-memory cache and rate limiter reset on server restart or cold start
- Rate limiter is not horizontally scalable across multiple serverless instances
- LLM extraction quality depends on the upstream model — occasional hallucination is possible despite strict prompting
- localStorage data is device-local and does not sync across browsers

---

## Future Improvements (Out of Scope)

These are architectural stretch goals not implemented in the current MVP:

- Persistent database storage (PostgreSQL/Redis) for user accounts and enrichment history
- Queue-based background enrichment with WebSocket progress updates
- GitHub and external API signal ingestion
- Vector similarity search for semantic company discovery
- Authenticated user sessions with role-based access control
- Distributed rate limiting and caching via Redis
