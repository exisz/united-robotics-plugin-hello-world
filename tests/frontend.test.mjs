import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

function installDom() {
  const dom = new JSDOM("<!doctype html><div id=plugin-root></div>", { url: "https://world.test/" });
  const previous = {};
  for (const key of ["window", "document", "Element", "HTMLElement", "Node", "Event", "MouseEvent", "navigator"]) {
    previous[key] = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
  }
  return () => {
    dom.window.close();
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor === undefined) delete globalThis[key];
      else Object.defineProperty(globalThis, key, descriptor);
    }
  };
}

async function settle(predicate, timeoutMs = 1_000) {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error("Timed out waiting for frontend update");
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

test("mount calls hello.greet, renders backend telemetry, and cleans up", async () => {
  const restore = installDom();
  try {
    const { mount } = await import(`../dist/plugin.js?test=${Date.now()}`);
    const root = document.querySelector("#plugin-root");
    const calls = [];
    const invoke = async (...args) => {
      calls.push(args);
      return {
        message: "Hello, Ada!",
        serverTime: "2026-09-01T00:00:00.000Z",
        runtime: "world-local-plugin-backend",
      };
    };

    const cleanup = mount(root, { props: { name: "Ada" }, invoke });
    assert.equal(typeof cleanup, "function");
    assert.match(root.textContent, /Hello, operator\./);
    assert.ok(root.querySelector("style")?.textContent.includes("ur-hello-world"));

    root.querySelector("form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    await settle(() => root.textContent.includes("Hello, Ada!"));

    assert.deepEqual(calls, [["hello.greet", { name: "Ada" }]]);
    assert.match(root.textContent, /2026-09-01T00:00:00\.000Z/);
    assert.match(root.textContent, /world-local-plugin-backend/);

    cleanup();
    assert.equal(root.childNodes.length, 0);
    cleanup();
  } finally {
    restore();
  }
});

test("cleanup ignores an invocation that resolves after unmount", async () => {
  const restore = installDom();
  try {
    const { mount } = await import(`../dist/plugin.js?cleanup=${Date.now()}`);
    const root = document.querySelector("#plugin-root");
    let resolveInvocation;
    const invocation = new Promise((resolve) => { resolveInvocation = resolve; });
    const cleanup = mount(root, { props: { name: "Grace" }, invoke: () => invocation });

    root.querySelector("form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    cleanup();
    resolveInvocation({
      message: "Hello, Grace!",
      serverTime: "2026-09-01T00:00:00.000Z",
      runtime: "world-local-plugin-backend",
    });
    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.equal(root.childNodes.length, 0);
  } finally {
    restore();
  }
});
