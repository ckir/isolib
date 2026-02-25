# isolib

Polyglot logging bridge (TS / Rust / Go) — repository scaffold.

This repo contains a TypeScript-first logging host (ts-sdk), guest SDK stubs for Rust and Go, example apps, configuration, developer tooling, and documentation.

## Quick start

1. Create the scaffold:
   ```bash
   python3 create_isolib_scaffold.py
   ```

2. Install dependencies with pnpm:
   ```bash
   cd packages/ts-sdk
   pnpm install
   ```

3. Run unit tests (Vitest):
   ```bash
   pnpm -w --filter @isolib/ts-sdk test:unit
   ```

4. Use the developer cockpit (Python):
   ```bash
   python3 dev_cockpit.py
   ```

5. Windows PowerShell interactive cockpit:
   ```powershell
   .\DevelopersCockpit.ps1
   ```

## Notes

- Log levels follow **Pino**: `fatal`, `error`, `warn`, `info`, `debug`, `trace`.
- This scaffold targets **TypeScript 6** in the TS SDK package.
- Canonical event schema and API docs live in the `docs/` folder.
- Native bindings (napi-rs, c-shared) are stubbed and will be implemented in later phases.
