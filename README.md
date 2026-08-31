# Hello World — United Robotics World plugin

The official minimal full-stack plugin for United Robotics World. It proves the
remote UI → World BFF → local one-shot backend path without a hosted service or
runtime install step.

## Artifact contract

`npm run build` creates exactly the three files World loads from one immutable
directory:

```text
dist/
├── manifest.json  # four-field World plugin manifest
├── plugin.js      # self-contained ESM UI (React, ReactDOM, and styles bundled)
└── rpc.mjs        # standalone Node ESM stdin/stdout backend
```

The frontend exports `mount(root, { props, invoke })`. Submitting a name calls
`hello.greet({ name })` and displays the backend's greeting, local server time,
and runtime identity. The backend accepts one version-1 JSON request on stdin,
writes one version-1 JSON response to stdout, and exits. It has no production
dependencies and performs no install at runtime.

## Develop and verify

Requires Node.js 22 or newer.

```bash
npm ci
npm run verify
```

`verify` rebuilds the committed artifacts and runs behavioral tests against the
built frontend and backend.

## Immutable jsDelivr URL

World frontlines must pin the manifest to the exact Git commit that contains the
artifacts. After the release commit exists, obtain its full 40-character SHA and
use:

```text
https://cdn.jsdelivr.net/gh/exisz/united-robotics-plugin-hello-world@<40-character-git-sha>/dist/manifest.json
```

For example, replace the placeholder with the output of `git rev-parse HEAD`.
Do not use `main`, a tag that can move, or jsDelivr's unversioned/latest form.
World derives `plugin.js` and `rpc.mjs` from the same immutable directory.

## Protocol example

Request on stdin:

```json
{"version":1,"method":"hello.greet","params":{"name":"Exis"}}
```

Response on stdout:

```json
{"version":1,"ok":true,"result":{"message":"Hello, Exis!","serverTime":"2026-08-28T00:00:00.000Z","runtime":"world-local-plugin-backend"}}
```
