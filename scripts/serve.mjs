// Serves the built site (the `out` folder) the way a static host does:
// "/about" answers with about.html, and an unknown address gets 404.html.
// Used by `npm run preview` and by the browser tests.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function isFile(path) {
  return existsSync(path) && statSync(path).isFile();
}

export function startServer(directory, port) {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const safe = normalize(pathname).replace(/^([/\\])+/, "");
    const base = join(directory, safe);
    // Never serve anything outside the site folder.
    if (base !== directory && !base.startsWith(directory + sep)) {
      response.writeHead(403).end();
      return;
    }

    const found = [base, `${base}.html`, join(base, "index.html")].find(isFile);
    const file = found ?? join(directory, "404.html");
    response.writeHead(found ? 200 : 404, {
      "content-type": types[extname(file)] ?? "application/octet-stream",
    });
    createReadStream(file).pipe(response);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

// Run directly: node scripts/serve.mjs [port]
if (process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1])) {
  const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
  if (!existsSync(join(out, "index.html"))) {
    console.error("No built site found. Run `npm run build` first.");
    process.exit(1);
  }
  const port = Number(process.argv[2]) || 3000;
  await startServer(out, port);
  console.log(`Built site running at http://localhost:${port}`);
}
