// Link checker: every Microsoft Learn (and other) URL in a skill must resolve.
// Zero external dependencies (uses node:https / node:http). Exit code 1 on broken links.
//
// Usage:
//   node validation/check-links.mjs            # check every URL
//   node validation/check-links.mjs --offline  # skip network, list URLs only
import { request } from "node:https";
import { request as httpRequest } from "node:http";
import { listSkills, extractUrls } from "./lib/skills.mjs";

const OFFLINE = process.argv.includes("--offline");
const TIMEOUT_MS = 20000;
const CONCURRENCY = 3;
const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 250; // polite pacing between requests per worker
// Statuses worth retrying. A persistent 429 means "reachable but throttled",
// not link rot, so it is treated as reachable after retries are exhausted.
const RETRY_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const THROTTLE_STATUS = 429;
const USER_AGENT =
  "Mozilla/5.0 (compatible; microsoft-security-skills-linkcheck/1.0; +https://github.com/microsoft/microsoft-security-skills)";

// Collect URL -> set of skills that reference it.
const urlToSkills = new Map();
for (const skill of listSkills()) {
  if (!skill.raw) continue;
  for (const url of extractUrls(skill.raw)) {
    if (!urlToSkills.has(url)) urlToSkills.set(url, new Set());
    urlToSkills.get(url).add(skill.name);
  }
}

const urls = [...urlToSkills.keys()].sort();
console.log(`Link check: ${urls.length} unique URL(s) across skills.`);

if (OFFLINE) {
  for (const url of urls) console.log(`  ${url}`);
  process.exit(0);
}

function check(url, redirects = 0) {
  return new Promise((resolve) => {
    let target;
    try {
      target = new URL(url);
    } catch {
      return resolve({ url, ok: false, status: "invalid-url" });
    }
    const lib = target.protocol === "http:" ? httpRequest : request;
    // Some Learn endpoints reject HEAD, so use a ranged GET and read nothing.
    const req = lib(
      target,
      {
        method: "GET",
        headers: { "User-Agent": USER_AGENT, Accept: "*/*", Range: "bytes=0-0" },
      },
      (res) => {
        const status = res.statusCode || 0;
        res.resume(); // drain
        if ([301, 302, 303, 307, 308].includes(status) && res.headers.location && redirects < 5) {
          const next = new URL(res.headers.location, target).toString();
          return resolve(check(next, redirects + 1).then((r) => ({ ...r, url })));
        }
        resolve({ url, ok: status >= 200 && status < 400, status });
      }
    );
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      resolve({ url, ok: false, status: "timeout" });
    });
    req.on("error", (err) => resolve({ url, ok: false, status: err.code || "error" }));
    req.end();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Check a URL with retries on transient failures (throttling, timeouts, 5xx).
async function checkWithRetry(url) {
  let result;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    result = await check(url);
    if (result.ok) return result;
    const transient =
      result.status === "timeout" ||
      result.status === "error" ||
      RETRY_STATUSES.has(result.status);
    if (!transient || attempt === MAX_ATTEMPTS) break;
    await sleep(attempt * 2000); // linear backoff
  }
  // A persistent 429 is rate-limiting, not link rot: the page is reachable.
  if (result.status === THROTTLE_STATUS) {
    return { ...result, ok: true, throttled: true };
  }
  return result;
}

async function run() {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < urls.length) {
      const url = urls[index++];
      results.push(await checkWithRetry(url));
      await sleep(BASE_DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const throttled = results.filter((r) => r.throttled).length;
  if (throttled > 0) {
    console.log(`Note: ${throttled} URL(s) were rate-limited (429) but reachable.`);
  }

  const broken = results.filter((r) => !r.ok).sort((a, b) => a.url.localeCompare(b.url));
  if (broken.length === 0) {
    console.log("PASS - all links resolve.");
    process.exit(0);
  }
  console.log(`FAIL - ${broken.length} broken link(s):\n`);
  for (const { url, status } of broken) {
    const skills = [...urlToSkills.get(url)].join(", ");
    console.log(`  [${status}] ${url}`);
    console.log(`      referenced by: ${skills}`);
  }
  process.exit(1);
}

run();
