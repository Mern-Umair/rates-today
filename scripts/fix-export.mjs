// Runs after `next build`.
//
// When a visitor follows a link, the browser asks for a small data file named like
// `__next.guides.__PAGE__.txt`. A build made on Windows writes that file as
// `__next.guides\__PAGE__.txt` instead (a folder and a file), because the exporter
// only turns forward slashes into dots. The request then gets a 404 and the browser
// falls back to loading the whole page.
//
// This puts the files where the browser looks for them. On Linux and macOS the
// build is already correct and this finds nothing to do.
import { existsSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out");

if (!existsSync(out)) {
  console.error("No `out` folder found. Run `next build` first.");
  process.exit(1);
}

function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

let moved = 0;
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (!statSync(path).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesIn(path)) {
        const flat = `${name}.${relative(path, file).split(sep).join(".")}`;
        renameSync(file, join(directory, flat));
        moved++;
      }
      rmSync(path, { recursive: true, force: true });
    } else {
      walk(path);
    }
  }
}

walk(out);
console.log(moved ? `Page data files put in place: ${moved}` : "Page data files already in place.");
