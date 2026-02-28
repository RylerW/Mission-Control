# Security Review & Hardening Plan: Mission-Control (n8nDash)

Date: 2026-02-27  
Scope: Source review of frontend (`src/*`), backend (`server/*`), and project configuration (`package.json`, `vite.config.ts`, `README.md`).

## Executive Summary

### Safety verdict
- **No obvious malware/backdoor behavior identified** in current source.
- **Safe enough for local demos / internal prototyping** with non-sensitive data.
- **Not production-safe yet** without authentication, origin restrictions, abuse protections, and secret-handling changes.

### Risk rating
- **Current posture:** Medium-High (for internet-facing deployment)
- **Primary risk drivers:** unauthenticated mutable API routes, wildcard CORS, browser-side auth pattern for n8n, side-effecting test webhooks mounted in UI.

---

## Review Method

Checked for:
1. Dangerous runtime primitives (`eval`, dynamic code execution, shell/process execution).
2. Public API attack surface and authorization gaps.
3. CORS, credential handling, and frontend-to-third-party proxy behavior.
4. Input validation and abuse controls (rate limiting, schema checks).
5. Dependency and build hygiene where environment allowed.

---

## Findings (Prioritized)

## 1) Missing API authentication/authorization on all routes  
**Severity: High**

Backend routes are callable without any identity or permission checks, including state-changing routes:
- `POST /api/content`
- `POST /api/agents/:id/toggle`
- `POST /api/agents/:id/run`

**Impact:** Any reachable client can mutate server state and trigger agent actions.

**Hardening actions:**
- Require auth (JWT/session/API key) on all non-health routes.
- Enforce per-route authorization (e.g., `agents:run`, `content:write`).
- Deny-by-default policy for unknown scopes/roles.

---

## 2) Wildcard CORS (`Access-Control-Allow-Origin: *`)  
**Severity: High (if deployed publicly)**

CORS currently permits any origin to read API responses.

**Impact:** Cross-origin websites can call API from victims’ browsers (especially dangerous once auth/cookies are introduced).

**Hardening actions:**
- Replace `*` with explicit allowlist (e.g., production UI origin + localhost for dev).
- Restrict methods and headers to minimum required.
- If using cookies, set `Access-Control-Allow-Credentials: true` and never use `*`.

---

## 3) n8n Basic Auth pattern in browser client  
**Severity: High (for real credentials)**

`N8nClient` can attach `Authorization` headers from frontend context.

**Impact:** Browser-visible credentials can be extracted from devtools, logs, extensions, or XSS.

**Hardening actions:**
- Move n8n auth to backend-only integration (server-to-server).
- Keep browser requests credential-free; issue short-lived server tokens if needed.
- Rotate any credentials previously used in browser context.

---

## 4) Test components trigger side-effect webhooks on page load  
**Severity: Medium**

`TestN8n` and `AgentStatusCard` send heartbeat calls on mount.

**Impact:** Merely visiting UI can trigger external workflows and noisy events.

**Hardening actions:**
- Remove from production bundle or gate behind explicit dev flag.
- Convert mount-time actions into explicit button-triggered actions.
- Add idempotency key and rate limits on receiver side.

---

## 5) No explicit request throttling / abuse controls  
**Severity: Medium**

API has no visible rate limiting or request-size controls.

**Impact:** Easy DoS/abuse path against mutable routes.

**Hardening actions:**
- Add IP/user rate limiting and burst control.
- Enforce request body size limits.
- Log and alert on repeated failed/abusive patterns.

---

## 6) Input validation is partial and ad hoc  
**Severity: Medium**

Some checks exist (e.g., `title/type`) but no schema-based validation across all endpoints.

**Impact:** Inconsistent behavior, weaker integrity guarantees, and future injection risk when persistence is added.

**Hardening actions:**
- Introduce schema validation for every input object (Zod/Ajv/Joi).
- Normalize and validate route params (`id`) and payload constraints.
- Return typed error objects with stable codes.

---

## 7) Missing baseline security headers  
**Severity: Medium**

No explicit CSP/HSTS/X-Frame-Options/Referrer-Policy/Permissions-Policy controls in backend responses.

**Impact:** Reduced browser-side hardening if exposed beyond local network.

**Hardening actions:**
- Add standard secure headers middleware/policy.
- Start with report-only CSP, then enforce.

---

## 8) Positive findings: no obvious malware indicators  
**Severity: Informational**

No obvious usage found of common high-risk execution primitives in reviewed app/server code paths.

**Caveat:** This is static source review, not runtime attestation.

---

## Dependency & Tooling Posture

- `npm ci`: success
- `npm run build`: success
- `npm run lint`: fails (no ESLint config present)
- `npm audit --audit-level=high --json`: unavailable in this environment (registry advisory endpoint returned HTTP 403)

**Hardening actions:**
- Add checked-in ESLint config and CI lint gate.
- Run SCA in CI (npm audit + secondary scanner).
- Add secret scanning (gitleaks/trufflehog) and dependency pinning policy.

---

## Production Hardening Blueprint (30/60/90)

### First 30 days (must-have)
1. Add authentication and per-route authorization.
2. Lock CORS to trusted origins.
3. Move n8n credentials server-side.
4. Remove/gate mount-time webhook tests.
5. Add schema validation + body size limit.

### Next 60 days (should-have)
1. Add rate limiting and abuse detection.
2. Add security headers + CSP rollout.
3. Add audit logging for mutating routes.
4. Add CI security checks (SCA, secret scanning, lint/test gates).

### Next 90 days (defense-in-depth)
1. Threat model for agent-trigger routes.
2. Pen-test focused on authz bypass and webhook abuse.
3. Incident response playbook and key rotation runbook.

---

## Deployment Decision Guidance

- **Go (demo/internal only):** yes, with synthetic/non-sensitive data and network isolation.
- **Go (public internet/prod):** no, until high-severity items above are remediated.

