import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

const backend = new URL("../dist/rpc.mjs", import.meta.url);

function invoke(input) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [backend.pathname], { stdio: ["pipe", "pipe", "pipe"] });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.once("error", reject);
    child.once("close", (code) => {
      const output = Buffer.concat(stdout).toString("utf8");
      resolve({ code, output, stderr: Buffer.concat(stderr).toString("utf8"), response: JSON.parse(output) });
    });
    child.stdin.end(typeof input === "string" ? input : JSON.stringify(input));
  });
}

test("hello.greet returns a local backend result in the version-1 envelope", async () => {
  const before = Date.now();
  const execution = await invoke({ version: 1, method: "hello.greet", params: { name: "  Exis  " } });
  const after = Date.now();

  assert.equal(execution.code, 0);
  assert.equal(execution.stderr, "");
  assert.equal(execution.response.version, 1);
  assert.equal(execution.response.ok, true);
  assert.equal(execution.response.result.message, "Hello, Exis!");
  assert.equal(execution.response.result.runtime, "world-local-plugin-backend");
  assert.ok(Date.parse(execution.response.result.serverTime) >= before);
  assert.ok(Date.parse(execution.response.result.serverTime) <= after);
  assert.equal(execution.output.trim().split("\n").length, 1);
});

test("backend rejects unknown methods with a bounded error envelope", async () => {
  const execution = await invoke({ version: 1, method: "system.exec", params: { name: "Exis" } });
  assert.deepEqual(execution.response, { version: 1, ok: false, error: { code: "method_not_found" } });
  assert.equal(execution.code, 0);
});

test("backend bounds and validates names", async () => {
  const empty = await invoke({ version: 1, method: "hello.greet", params: { name: "   " } });
  const long = await invoke({ version: 1, method: "hello.greet", params: { name: "x".repeat(81) } });
  const extra = await invoke({ version: 1, method: "hello.greet", params: { name: "Exis", path: "/tmp" } });

  assert.equal(empty.response.error.code, "invalid_name");
  assert.equal(long.response.error.code, "invalid_name");
  assert.equal(extra.response.error.code, "invalid_params");
});

test("backend rejects malformed and oversized input without unbounded output", async () => {
  const malformed = await invoke("not-json");
  const oversized = await invoke(" ".repeat(16 * 1024 + 1));

  assert.deepEqual(malformed.response, { version: 1, ok: false, error: { code: "invalid_json" } });
  assert.deepEqual(oversized.response, { version: 1, ok: false, error: { code: "request_too_large" } });
  assert.ok(malformed.output.length < 128);
  assert.ok(oversized.output.length < 128);
});
