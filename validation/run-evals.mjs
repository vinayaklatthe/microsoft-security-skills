// Behavioural eval runner: does loading a skill drive the desired outcome?
//
// Each case file (validation/cases/<skill>.json) lists prompts and the
// "must-mention" assertions a good answer should contain, grounded in the
// skill's Microsoft Learn references.
//
// Two modes:
//
//   coverage (default) - zero-dependency, runs in CI.
//       Proves the skill *contains* the knowledge each desired outcome needs:
//       every assertion must be grounded somewhere in the SKILL.md. If an
//       assertion is not covered, the skill cannot drive that outcome.
//
//   answers --dir <path> - true behavioural eval.
//       Scores model-generated answers (one .txt per case, named
//       "<skill>__<index>.txt") against the assertions. Generate the answers
//       with the skill loaded using any model, then run this to score them.
//
// Usage:
//   node validation/run-evals.mjs
//   node validation/run-evals.mjs --answers --dir ./answers
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listSkills, splitFrontmatter } from "./lib/skills.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const casesDir = join(here, "cases");
const args = process.argv.slice(2);
const MODE = args.includes("--answers") ? "answers" : "coverage";
const REPORT = args.includes("--report");
const answersDir = (() => {
  const i = args.indexOf("--dir");
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
})();

// One assertion is satisfied if its text (or any alternative) is present.
function assertionMet(assertion, haystack) {
  const text = haystack.toLowerCase();
  const alternatives = typeof assertion === "string" ? [assertion] : assertion.any || [];
  const label = typeof assertion === "string" ? assertion : assertion.label || alternatives.join(" / ");
  const met = alternatives.some((alt) => text.includes(String(alt).toLowerCase()));
  return { label, met };
}

function loadCases() {
  if (!existsSync(casesDir)) return [];
  return readdirSync(casesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const skill = f.replace(/\.json$/, "");
      const data = JSON.parse(readFileSync(join(casesDir, f), "utf8"));
      return { skill, cases: data.cases || [] };
    });
}

const skillBodies = new Map();
for (const skill of listSkills()) {
  if (skill.raw) skillBodies.set(skill.name, splitFrontmatter(skill.raw).body);
}

const suites = loadCases();
if (suites.length === 0) {
  console.log("No eval cases found in validation/cases/. Nothing to run.");
  process.exit(0);
}

let totalAssertions = 0;
let totalMet = 0;
const failures = [];
const reportBlocks = [];

for (const { skill, cases } of suites) {
  const body = skillBodies.get(skill);
  if (body === undefined && MODE === "coverage") {
    failures.push(`${skill}: no matching SKILL.md found`);
    continue;
  }

  cases.forEach((c, idx) => {
    let haystack;
    if (MODE === "coverage") {
      haystack = body;
    } else {
      const answerFile = join(answersDir, `${skill}__${idx}.txt`);
      if (!existsSync(answerFile)) {
        failures.push(`${skill} case ${idx}: missing answer file ${answerFile}`);
        return;
      }
      haystack = readFileSync(answerFile, "utf8");
    }

    const results = (c.expect || []).map((a) => assertionMet(a, haystack));
    const met = results.filter((r) => r.met).length;
    totalAssertions += results.length;
    totalMet += met;

    if (REPORT) {
      const col = MODE === "coverage" ? "In skill" : "With skill";
      const lines = [];
      lines.push(`#### ${skill} - "${c.prompt}"`);
      lines.push("");
      lines.push(`| Expected outcome | ${col} |`);
      lines.push("|---|---|");
      for (const r of results) {
        lines.push(`| ${r.label} | ${r.met ? "Hit" : "Miss"} |`);
      }
      lines.push(`| **Score** | **${met}/${results.length}** |`);
      lines.push("");
      reportBlocks.push(lines.join("\n"));
    }

    if (met < results.length) {
      const missed = results.filter((r) => !r.met).map((r) => r.label);
      failures.push(
        `${skill} case ${idx} (${met}/${results.length}) "${c.prompt}"\n      missed: ${missed.join("; ")}`
      );
    }
  });
}

if (REPORT) {
  const heading = MODE === "coverage" ? "Coverage report" : "Behavioural eval report";
  console.log(`# ${heading}\n`);
  console.log(`Total: ${totalMet}/${totalAssertions} expected outcomes met across ${suites.length} skill(s).\n`);
  console.log(reportBlocks.join("\n"));
  process.exit(failures.length === 0 ? 0 : 1);
}

const label = MODE === "coverage" ? "Coverage eval (knowledge grounded in skill)" : "Behavioural eval (scored answers)";
console.log(`${label}: ${totalMet}/${totalAssertions} assertions met across ${suites.length} skill(s).`);

if (failures.length === 0) {
  console.log("PASS - every desired outcome is covered.");
  process.exit(0);
}
console.log(`\nGaps:\n`);
for (const f of failures) console.log(`  - ${f}`);
process.exit(1);
