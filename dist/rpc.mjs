const PROTOCOL_VERSION = 1;
const MAX_REQUEST_BYTES = 16 * 1024;
const MAX_NAME_LENGTH = 80;
const METHOD = "hello.greet";
const RUNTIME = "world-local-plugin-backend";

class ProtocolError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, expected) {
  const actual = Object.keys(value).sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

async function readRequest() {
  const chunks = [];
  let size = 0;

  for await (const chunk of process.stdin) {
    size += chunk.length;
    if (size > MAX_REQUEST_BYTES) throw new ProtocolError("request_too_large");
    chunks.push(chunk);
  }

  if (size === 0) throw new ProtocolError("invalid_request");

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ProtocolError("invalid_json");
  }
}

function validateRequest(request) {
  if (!isRecord(request) || !exactKeys(request, ["method", "params", "version"])) {
    throw new ProtocolError("invalid_request");
  }
  if (request.version !== PROTOCOL_VERSION) throw new ProtocolError("unsupported_version");
  if (request.method !== METHOD) throw new ProtocolError("method_not_found");
  if (!isRecord(request.params) || !exactKeys(request.params, ["name"])) {
    throw new ProtocolError("invalid_params");
  }
  if (typeof request.params.name !== "string") throw new ProtocolError("invalid_name");

  const name = request.params.name.trim();
  if (!name || Array.from(name).length > MAX_NAME_LENGTH) throw new ProtocolError("invalid_name");
  return name;
}

function writeResponse(response) {
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

try {
  const request = await readRequest();
  const name = validateRequest(request);
  writeResponse({
    version: PROTOCOL_VERSION,
    ok: true,
    result: {
      message: `Hello, ${name}!`,
      serverTime: new Date().toISOString(),
      runtime: RUNTIME,
    },
  });
} catch (error) {
  const known = error instanceof ProtocolError;
  writeResponse({
    version: PROTOCOL_VERSION,
    ok: false,
    error: { code: known ? error.code : "internal_error" },
  });
  if (!known) process.exitCode = 1;
}
