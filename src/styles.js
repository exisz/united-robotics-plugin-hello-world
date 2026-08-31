export const styles = String.raw`
.ur-hello-world {
  --hw-ink: #e7ece6;
  --hw-muted: #8a9690;
  --hw-panel: #151a19;
  --hw-deep: #0d1110;
  --hw-line: #36403c;
  --hw-amber: #f2b544;
  --hw-mint: #86d6b1;
  box-sizing: border-box;
  min-width: 260px;
  color: var(--hw-ink);
  background: var(--hw-deep);
  border: 1px solid #2c3532;
  font-family: "Avenir Next Condensed", "DIN Condensed", "Roboto Condensed", sans-serif;
  container-type: inline-size;
}

.ur-hello-world *,
.ur-hello-world *::before,
.ur-hello-world *::after { box-sizing: inherit; }

.ur-hello-world__rail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  padding: 0 12px;
  border-bottom: 1px solid var(--hw-line);
  background: #1c2320;
  color: var(--hw-muted);
  font: 700 10px/1 "SFMono-Regular", "Cascadia Mono", monospace;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.ur-hello-world__rail-mark { color: var(--hw-amber); }

.ur-hello-world__body {
  position: relative;
  padding: 16px;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(134, 214, 177, .035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(134, 214, 177, .035) 1px, transparent 1px);
  background-size: 18px 18px;
}

.ur-hello-world__body::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--hw-amber);
}

.ur-hello-world__heading {
  margin: 0 0 3px;
  font-size: clamp(21px, 7cqi, 28px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.035em;
}

.ur-hello-world__deck {
  margin: 0 0 14px;
  color: #9ca7a2;
  font: 500 11px/1.4 "SFMono-Regular", "Cascadia Mono", monospace;
}

.ur-hello-world__bus {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 13px;
  padding: 5px 7px;
  border-left: 2px solid var(--hw-amber);
  border-top: 1px solid #3a4541;
  border-bottom: 1px solid #3a4541;
  color: #a9b4ae;
  background: #111614;
  font: 700 9px/1 "SFMono-Regular", "Cascadia Mono", monospace;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.ur-hello-world__bus strong {
  color: var(--hw-amber);
  font: inherit;
}

.ur-hello-world__form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 7px;
  margin-bottom: 14px;
}

.ur-hello-world__label {
  grid-column: 1 / -1;
  color: var(--hw-muted);
  font: 700 9px/1 "SFMono-Regular", "Cascadia Mono", monospace;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.ur-hello-world__input {
  width: 100%;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid var(--hw-line);
  border-radius: 0;
  outline: none;
  color: var(--hw-ink);
  background: #0b0f0e;
  font: 600 14px/1 "SFMono-Regular", "Cascadia Mono", monospace;
}

.ur-hello-world__input:focus {
  border-color: var(--hw-mint);
  box-shadow: inset 3px 0 0 var(--hw-mint);
}

.ur-hello-world__button {
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid var(--hw-amber);
  border-radius: 0;
  color: #17130a;
  background: #dca033;
  cursor: pointer;
  font: 800 11px/1 "SFMono-Regular", "Cascadia Mono", monospace;
  letter-spacing: .055em;
  text-transform: uppercase;
  transition: background-color 120ms ease, color 120ms ease, transform 120ms ease;
}

.ur-hello-world__button:hover:not(:disabled) { background: #ffd172; }
.ur-hello-world__button:active:not(:disabled) { transform: translateY(1px); }
.ur-hello-world__button:disabled { cursor: not-allowed; opacity: .48; }

.ur-hello-world__readout {
  min-height: 108px;
  padding: 11px;
  border: 1px solid var(--hw-line);
  background: rgba(21, 26, 25, .94);
}

.ur-hello-world__status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 9px;
  color: #a4afa9;
  font: 700 10px/1 "SFMono-Regular", "Cascadia Mono", monospace;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.ur-hello-world__lamp {
  width: 7px;
  height: 7px;
  border: 1px solid #88948e;
  background: #59635f;
}

.ur-hello-world__lamp--live {
  border-color: var(--hw-mint);
  background: var(--hw-mint);
  box-shadow: 0 0 9px rgba(134, 214, 177, .45);
}

.ur-hello-world__lamp--working {
  border-color: var(--hw-amber);
  background: var(--hw-amber);
  animation: ur-hello-world-pulse 700ms steps(2, end) infinite;
}

.ur-hello-world__message {
  margin: 0 0 12px;
  color: var(--hw-ink);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.15;
}

.ur-hello-world__message--idle { color: #aeb8b3; }
.ur-hello-world__message--error { color: #ff8e78; }

.ur-hello-world__telemetry {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 4px 10px;
  margin: 0;
  font: 500 9px/1.35 "SFMono-Regular", "Cascadia Mono", monospace;
}

.ur-hello-world__telemetry dt {
  color: #a1aca6;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.ur-hello-world__telemetry dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--hw-mint);
}

@keyframes ur-hello-world-pulse { 50% { opacity: .28; } }

@media (prefers-reduced-motion: reduce) {
  .ur-hello-world__button { transition: none; }
  .ur-hello-world__lamp--working { animation: none; }
}

@container (max-width: 330px) {
  .ur-hello-world__form { grid-template-columns: 1fr; }
  .ur-hello-world__label { grid-column: auto; }
  .ur-hello-world__button { width: 100%; }
}
`;
