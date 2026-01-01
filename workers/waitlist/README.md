# Waitlist Worker

Cloudflare Worker for handling Rails LLM Course waitlist signups.

## Setup

1. Install dependencies:
   ```bash
   cd workers/waitlist
   npm install
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create the KV namespace:
   ```bash
   wrangler kv:namespace create WAITLIST_KV
   ```

   Copy the ID from the output and update `wrangler.toml`.

4. Deploy:
   ```bash
   npm run deploy
   ```

   Note the worker URL (e.g., `https://waitlist.YOUR_SUBDOMAIN.workers.dev`)

5. Update the form action in `content/rails-llm-course/_index.md` with your worker URL.

## Development

Run locally:
```bash
npm run dev
```

## Viewing Submissions

List all emails:
```bash
wrangler kv:key list --binding WAITLIST_KV --preview false
```

Get a specific entry:
```bash
wrangler kv:get "email:someone@example.com" --binding WAITLIST_KV --preview false
```

Export all (requires a script or Cloudflare dashboard).

## Optional: Custom Domain

To use `api.damiangalarza.com/waitlist`:

1. Add a DNS record in Cloudflare pointing to Workers
2. Uncomment and configure the `routes` section in `wrangler.toml`
3. Redeploy
