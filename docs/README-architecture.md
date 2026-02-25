# Architecture Summary

isolib uses a host-managed FFI bridge pattern:
- TypeScript host acts as central router and transport manager.
- Rust and Go guests serialize canonical JSON and call into the host via FFI.
- One JSON object per line is the wire format.
- Pino log levels are used across the system.
