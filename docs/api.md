# API Reference (sketch)

## TypeScript (host)
- `createLogger(config?)` -> logger instance with methods:
  - `trace(msg, { extras? })`
  - `debug(msg, { extras? })`
  - `info(msg, { extras? })`
  - `warn(msg, { extras? })`
  - `error(msg, { extras? })`
  - `fatal(msg, { extras? })`

- `coreLogger` (used before config) exposes `info`, `error`, `debug`.

## Rust (guest)
- Provide a `tracing::Layer` that serializes events to canonical JSON and calls the bridge.
- Minimal helper: `fn log_info(message: &str, extras_json: Option<&str>)`.

## Go (guest)
- Provide an `slog.Handler` that serializes events to canonical JSON and calls the C-shared bridge function.

## FFI contract
- Bridge callback signature (JS): `(line: string) => void`
- Guests must send one JSON object per line (line-delimited JSON) matching the canonical schema.
