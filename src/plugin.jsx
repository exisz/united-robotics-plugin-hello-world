import React, { useId, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { styles } from "./styles.js";

const MAX_NAME_LENGTH = 80;

function initialName(props) {
  return typeof props?.name === "string" ? props.name.slice(0, MAX_NAME_LENGTH) : "";
}

function validResult(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof value.message === "string" &&
    typeof value.serverTime === "string" &&
    typeof value.runtime === "string",
  );
}

function HelloWorldPanel({ props, invoke, lifecycle }) {
  const inputId = useId();
  const [name, setName] = useState(() => initialName(props));
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function greet(event) {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) return;

    const operation = ++lifecycle.operation;
    setPhase("working");
    setError("");

    try {
      const response = await invoke("hello.greet", { name: normalizedName });
      if (!validResult(response)) throw new Error("Backend returned an invalid response.");
      if (!lifecycle.active || operation !== lifecycle.operation) return;
      setResult(response);
      setPhase("live");
    } catch (cause) {
      if (!lifecycle.active || operation !== lifecycle.operation) return;
      setError(cause instanceof Error ? cause.message : "Backend call failed.");
      setPhase("error");
    }
  }

  const status = phase === "working" ? "Calling local backend" : phase === "live" ? "Backend return" : phase === "error" ? "Call fault" : "Link ready";
  const message = phase === "error" ? error : result?.message ?? "Awaiting local response";

  return (
    <section className="ur-hello-world" aria-label="Hello World plugin">
      <style>{styles}</style>
      <header className="ur-hello-world__rail">
        <span><span className="ur-hello-world__rail-mark">◆</span> WORLD / LOCAL RPC</span>
        <span>NODE 01</span>
      </header>
      <div className="ur-hello-world__body">
        <h2 className="ur-hello-world__heading">Hello, operator.</h2>
        <p className="ur-hello-world__deck">Send a signal through the World local plugin runtime.</p>
        <div className="ur-hello-world__bus" aria-hidden="true">
          <span>RPC channel</span>
          <strong>HELLO.GREET</strong>
        </div>

        <form className="ur-hello-world__form" onSubmit={greet}>
          <label className="ur-hello-world__label" htmlFor={inputId}>Callsign / name</label>
          <input
            id={inputId}
            className="ur-hello-world__input"
            name="name"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            placeholder="Enter name"
            onChange={(event) => setName(event.target.value)}
          />
          <button className="ur-hello-world__button" type="submit" disabled={!name.trim() || phase === "working"}>
            {phase === "working" ? "Calling…" : "Call backend"}
          </button>
        </form>

        <div className="ur-hello-world__readout" aria-live="polite">
          <div className="ur-hello-world__status">
            <span className={`ur-hello-world__lamp ur-hello-world__lamp--${phase}`} aria-hidden="true" />
            {status}
          </div>
          <p className={`ur-hello-world__message ur-hello-world__message--${phase}`}>{message}</p>
          <dl className="ur-hello-world__telemetry">
            <dt>Server time</dt>
            <dd>{result?.serverTime ?? "—"}</dd>
            <dt>Runtime</dt>
            <dd>{result?.runtime ?? "—"}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function mount(root, { props = {}, invoke } = {}) {
  if (!(root instanceof Element)) throw new TypeError("Hello World mount root must be an Element.");
  if (typeof invoke !== "function") throw new TypeError("Hello World requires an invoke function.");

  const lifecycle = { active: true, operation: 0 };
  const reactRoot = createRoot(root);
  flushSync(() => reactRoot.render(<HelloWorldPanel props={props} invoke={invoke} lifecycle={lifecycle} />));

  return () => {
    if (!lifecycle.active) return;
    lifecycle.active = false;
    lifecycle.operation += 1;
    reactRoot.unmount();
  };
}
