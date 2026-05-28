# Pierwsze wdrozenie TrAIner na Cloudflare Workers

## Summary

- Cel: pierwszy reczny deploy na `workers.dev`, zgodnie z `context/foundation/infrastructure.md`.
- Platforma: Cloudflare Workers, nie Pages.
- Worker: uzyc istniejacego Workera `10x-astro-starter`; nie zmieniac nazwy na `trainer`.
- Supabase: hosted project jest utworzony, local Supabase jest skonfigurowany, sekrety sa ustawione w Cloudflare Workers.
- Obecny stan: `npx astro sync` + `npm run lint` przechodza, `npm run build` przechodzi, `npx wrangler deploy --dry-run` przechodzi; dry-run potwierdzil bindingi `ASSETS`, `SESSION`, `IMAGES`.
- Deploy wykonany: `https://10x-astro-starter.antekgaw.workers.dev`, version `b0c162a0-a92b-43b4-a747-5cab61cd8ab4`.
- Poprawka potwierdzania maila: dodano `/auth/confirm` i wdrozono version `e08af159-32e6-4409-87bb-3636f48a07f1`.
- Poprawka logowania: udany signin przekierowuje na `/dashboard` zamiast pustej listy `/`; wdrozono version `e11a3ff0-218c-47f3-aa2b-21a0c14223b6`.

## Key changes

- Zapisac zatwierdzony plan w `context/deployment/deploy-plan.md`.
- W `wrangler.jsonc` zostawic:
  - `"name": "10x-astro-starter"`
  - dodac `"secrets": { "required": ["SUPABASE_URL", "SUPABASE_KEY"] }`
- Nie dodawac recznie KV ani Images: Astro Cloudflare adapter automatycznie konfiguruje `SESSION` KV i `IMAGES`, a Wrangler moze je auto-provisionowac przy deployu.
- Nie uzywac `wrangler pages deploy`.
- Nie uzywac `wrangler versions upload` jako pierwszego uploadu, bo pierwszy deploy nowego Workera musi isc przez `wrangler deploy`.

## Execution steps

1. Supabase i Cloudflare sa przygotowane.
   - Wlaczyc email/password auth i produkcyjne email confirmations.
   - Po deployu ustawic Supabase Auth Site URL na finalny `https://10x-astro-starter.<account-subdomain>.workers.dev`.
   - Do `SUPABASE_KEY` uzyc publishable key albo legacy anon key, nigdy `service_role` ani `sb_secret_*`.

2. Zalogowac Cloudflare CLI:

   ```bash
   npx wrangler login
   npx wrangler whoami
   ```

3. Potwierdzic, ze sekrety `SUPABASE_URL` i `SUPABASE_KEY` sa ustawione dla Workera `10x-astro-starter`.

4. Zweryfikowac przed deployem:

   ```bash
   npx astro sync
   npm run lint
   npm run build
   npx wrangler deploy --dry-run
   ```

5. Wykonac pierwszy deploy:

   ```bash
   npx wrangler deploy --message "Initial Workers deploy"
   ```

6. Zanotowac URL `workers.dev`.

7. Ustawic w Supabase Auth URL Configuration:
   - Site URL: finalny `workers.dev` URL
   - Redirect URLs: dokladny produkcyjny URL lub `https://10x-astro-starter.<account-subdomain>.workers.dev/**`

## Test plan

- Smoke HTTP:
  - `/` zwraca 200.
  - `/auth/signin` zwraca 200.
  - `/auth/signup` zwraca 200.
  - `/dashboard` bez sesji przekierowuje do `/auth/signin`.
- Smoke auth:
  - utworzyc testowego uzytkownika,
  - potwierdzic email,
  - zalogowac sie,
  - wejsc na `/dashboard`,
  - wylogowac sie,
  - potwierdzic, ze `/dashboard` znow przekierowuje.
- Logs:

  ```bash
  npx wrangler tail 10x-astro-starter --format json
  ```

- Rollback:

  ```bash
  npx wrangler rollback <VERSION_ID> --message "rollback initial deploy"
  ```

## Assumptions and references

- Custom domain i CI/CD deploy sa poza pierwszym wdrozeniem; startujemy od `workers.dev`.
- Istniejace, niezwiazane zmiany w `AGENTS.md` i `context/foundation/infrastructure.md` nie sa cofane.
- Zweryfikowane zrodla: Astro Cloudflare adapter, Cloudflare Wrangler/secrets/deploy docs, Supabase Auth redirect/API key docs.
