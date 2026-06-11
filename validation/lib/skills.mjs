// Shared helpers for the validation harness. Zero external dependencies.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(here, "..", "..");
export const skillsDir = join(repoRoot, "skills");

// Return a list of { name, path, raw } for every skill that has a SKILL.md.
export function listSkills() {
  return readdirSync(skillsDir)
    .filter((entry) => {
      try {
        return statSync(join(skillsDir, entry)).isDirectory();
      } catch {
        return false;
      }
    })
    .map((name) => {
      const path = join(skillsDir, name, "SKILL.md");
      let raw = null;
      try {
        raw = readFileSync(path, "utf8");
      } catch {
        raw = null;
      }
      return { name, path, raw };
    });
}

// Split a SKILL.md into { frontmatter (raw text), body }.
export function splitFrontmatter(raw) {
  if (!raw) return { frontmatter: "", body: "" };
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: "", body: raw };
  return { frontmatter: match[1], body: match[2] };
}

// Parse the small, known frontmatter shape without a YAML dependency.
// Handles top-level scalars and the nested `metadata:` block used by these skills.
export function parseFrontmatter(frontmatter) {
  const result = {};
  let inMetadata = false;
  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const indented = /^\s+/.test(line);
    if (!indented) {
      inMetadata = false;
      const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      const value = stripQuotes(m[2]);
      if (key === "metadata" && value === "") {
        inMetadata = true;
        result.metadata = {};
      } else {
        result[key] = value;
      }
    } else if (inMetadata) {
      const m = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
      if (m) result.metadata[m[1]] = stripQuotes(m[2]);
    }
  }
  return result;
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

// Extract markdown H2 section headings (## Foo) from the body.
export function sectionHeadings(body) {
  return body
    .split(/\r?\n/)
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim());
}

// Pull every http(s) URL out of a string.
export function extractUrls(text) {
  const urls = new Set();
  const re = /https?:\/\/[^\s)\]<>"']+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    urls.add(m[0].replace(/[.,;]+$/, ""));
  }
  return [...urls];
}
