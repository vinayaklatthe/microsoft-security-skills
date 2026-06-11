// Side-by-side behavioural comparison: baseline (no skill) vs with-skill.
//
// Scores both answer sets against the same assertions in validation/cases/
// and prints a per-case + per-skill table with the lift the skill provides.
//
// Usage:
//   node validation/compare-evals.mjs
//   node validation/compare-evals.mjs --baseline <dir> --withskill <dir> --report
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const casesDir = join(here, "cases");
const args = process.argv.slice(2);
const REPORT = args.includes("--report");
function argVal(flag, fallback) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const baselineDir = join(here, argVal("--baseline", "answers/baseline"));
const withskillDir = join(here, argVal("--withskill", "answers/with-skill"));

function assertionMet(assertion, haystack) {
  const text = haystack.toLowerCase();
  const alternatives = typeof assertion === "string" ? [assertion] : assertion.any || [];
  return alternatives.some((alt) => text.includes(String(alt).toLowerCase()));
}
function score(dir, skill, idx, expect) {
  const file = join(dir, `${skill}__${idx}.txt`);
  if (!existsSync(file)) return null; // not captured for this condition
  const text = readFileSync(file, "utf8");
  const met = expect.filter((a) => assertionMet(a, text)).length;
  return { met, total: expect.length };
}

const suites = readdirSync(casesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({
    skill: f.replace(/\.json$/, ""),
    cases: (JSON.parse(readFileSync(join(casesDir, f), "utf8")).cases) || [],
  }));

const rows = [];
let baseMet = 0;
let withMet = 0;
let total = 0;
const perSkill = new Map();

for (const { skill, cases } of suites) {
  cases.forEach((c, idx) => {
    const expect = c.expect || [];
    const b = score(baselineDir, skill, idx, expect);
    const w = score(withskillDir, skill, idx, expect);
    if (!b && !w) return; // neither condition captured this case
    const bm = b ? b.met : null;
    const wm = w ? w.met : null;
    if (b) baseMet += b.met;
    if (w) withMet += w.met;
    total += expect.length;
    rows.push({ skill, prompt: c.prompt, bm, wm, total: expect.length });

    const agg = perSkill.get(skill) || { base: 0, with: 0, total: 0 };
    agg.base += b ? b.met : 0;
    agg.with += w ? w.met : 0;
    agg.total += expect.length;
    perSkill.set(skill, agg);
  });
}

if (rows.length === 0) {
  console.log("No comparable cases found. Capture answers in both folders first.");
  process.exit(0);
}

const fmt = (n) => (n === null ? "-" : String(n));

if (REPORT) {
  console.log("# Behavioural comparison: baseline vs with-skill\n");
  console.log(`Baseline: ${baseMet}/${total} | With skill: ${withMet}/${total} | Lift: +${withMet - baseMet}\n`);
  console.log("| Skill | Prompt | Baseline | With skill | Lift |");
  console.log("|---|---|---|---|---|");
  for (const r of rows) {
    const lift = r.bm !== null && r.wm !== null ? r.wm - r.bm : "-";
    console.log(`| ${r.skill} | ${r.prompt} | ${fmt(r.bm)}/${r.total} | ${fmt(r.wm)}/${r.total} | ${lift === "-" ? "-" : "+" + lift} |`);
  }
  process.exit(0);
}

console.log(`Behavioural comparison (${rows.length} case(s) scored):\n`);
console.log(`  Baseline (no skill):  ${baseMet}/${total}`);
console.log(`  With skill loaded:    ${withMet}/${total}`);
console.log(`  Lift from skills:     +${withMet - baseMet} outcome(s)\n`);

const improved = [];
for (const [skill, a] of perSkill) {
  if (a.with > a.base) improved.push(`${skill}  ${a.base}/${a.total} -> ${a.with}/${a.total}  (+${a.with - a.base})`);
}
if (improved.length) {
  console.log("Skills the skill improved:");
  for (const line of improved.sort()) console.log(`  - ${line}`);
} else {
  console.log("No per-skill improvement detected (baseline already matched with-skill).");
}
