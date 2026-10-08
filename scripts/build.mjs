import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const manifestSource = new URL("../src/manifest.json", import.meta.url);
const rpcSource = new URL("../src/rpc.mjs", import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const manifest = JSON.parse(await readFile(manifestSource, "utf8"));
const expectedManifest = {
  schemaVersion: 1,
  id: "hello-world",
  name: "Hello World",
  publisher: "United Robotics",
};
if (JSON.stringify(manifest) !== JSON.stringify(expectedManifest)) {
  throw new Error("src/manifest.json must contain exactly the four approved fields");
}

await build({
  entryPoints: [new URL("../src/plugin.jsx", import.meta.url).pathname],
  outfile: new URL("plugin.js", dist).pathname,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  sourcemap: false,
  logLevel: "info",
});

await writeFile(new URL("manifest.json", dist), `${JSON.stringify(manifest, null, 2)}\n`);
await cp(rpcSource, new URL("rpc.mjs", dist));
await cp(new URL("../src/agent.json", import.meta.url), new URL("agent.json", dist));
