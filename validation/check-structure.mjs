// Structural validator: every skill must be well-formed and discoverable.
// Zero external dependencies. Exit code 1 if any skill fails.
import {
  listSkills,
  splitFrontmatter,
  parseFrontmatter,
  sectionHeadings,
} from "./lib/skills.mjs";

const REQUIRED_FRONTMATTER = ["name", "description", "license"];
const REQUIRED_METADATA = ["author", "version"];
// Each required section is matched case-insensitively against the H2 headings.
// A regex allows accepted heading variants (e.g. "Approach" or "Design approach").
const REQUIRED_SECTIONS = [
  { label: "When to use", match: /^when to use$/i },
  { label: "Approach (or Design approach)", match: /approach/i },
  { label: "Guardrails", match: /^guardrails$/i },
  { label: "Microsoft Learn", match: /^microsoft learn$/i },
];

const skills = listSkills();
let failures = 0;
const report = [];

for (const skill of skills) {
  const problems = [];

  if (!skill.raw) {
    problems.push("SKILL.md missing or unreadable");
    report.push({ name: skill.name, problems });
    failures += problems.length;
    continue;
  }

  const { frontmatter, body } = splitFrontmatter(skill.raw);
  if (!frontmatter) problems.push("missing YAML frontmatter (--- block)");

  const fm = parseFrontmatter(frontmatter);

  for (const key of REQUIRED_FRONTMATTER) {
    if (!fm[key]) problems.push(`frontmatter missing: ${key}`);
  }
  for (const key of REQUIRED_METADATA) {
    if (!fm.metadata || !fm.metadata[key]) problems.push(`metadata missing: ${key}`);
  }

  if (fm.name && fm.name !== skill.name) {
    problems.push(`frontmatter name "${fm.name}" != folder "${skill.name}"`);
  }

  if (fm.description && !/WHEN:/i.test(fm.description)) {
    problems.push("description missing WHEN: trigger clause");
  }

  const headings = sectionHeadings(body);
  for (const section of REQUIRED_SECTIONS) {
    if (!headings.some((h) => section.match.test(h))) {
      problems.push(`missing section: ## ${section.label}`);
    }
  }

  if (problems.length) {
    report.push({ name: skill.name, problems });
    failures += problems.length;
  }
}

console.log(`Structural check: ${skills.length} skills scanned.`);
if (failures === 0) {
  console.log("PASS - all skills are well-formed.");
  process.exit(0);
}

console.log(`FAIL - ${failures} problem(s) across ${report.length} skill(s):\n`);
for (const { name, problems } of report) {
  console.log(`  ${name}`);
  for (const p of problems) console.log(`    - ${p}`);
}
process.exit(1);
