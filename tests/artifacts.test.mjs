import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);

test("dist contains the fixed artifact contract (three World files plus agent.json)", async () => {
  assert.deepEqual((await readdir(dist)).sort(), ["agent.json", "manifest.json", "plugin.js", "rpc.mjs"]);
});

test("manifest contains exactly the four approved fields", async () => {
  const manifest = JSON.parse(await readFile(new URL("manifest.json", dist), "utf8"));
  assert.deepEqual(manifest, {
    schemaVersion: 1,
    id: "hello-world",
    name: "Hello World",
    publisher: "United Robotics",
  });
  assert.deepEqual(Object.keys(manifest), ["schemaVersion", "id", "name", "publisher"]);
});

test("frontend bundle is self-contained ESM without external imports or emitted CSS", async () => {
  const bundle = await readFile(new URL("plugin.js", dist), "utf8");
  assert.match(bundle, /export\{/);
  assert.match(bundle, /mount/);
  assert.match(bundle, /ur-hello-world/);
  assert.doesNotMatch(bundle, /from[\t ]*["'](?:react|react-dom|\.\/)/);
  assert.doesNotMatch(bundle, /sourceMappingURL/);
});
