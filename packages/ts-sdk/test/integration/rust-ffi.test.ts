import { describe, it, expect, vi } from "vitest";
import { bridgeConnector } from "../../src/connections/bridge-connector.js";
import "../../src/core/singleton.js";

describe("Polyglot FFI Integration", () => {
  it("should receive a log from Rust and route it through the TS Kernel", () => {
    let capturedLine = "";
    
    // Intercept the TS logger's output via the global singleton
    vi.spyOn(globalThis.isolibLogger, 'log').mockImplementation((_lvl, msg) => {
      capturedLine = msg;
    });

    const native = bridgeConnector.getNative();
    
    if (!native) {
        throw new Error("❌ Native bridge module NOT loaded. Run Cockpit Option 3 and check file: packages/ts-sdk/src/native/index.node");
    }

    // Invoke the Rust Guest function
    // We access it directly from the loaded native module
    native.log_from_rust("error", "Critical failure in Rust module", JSON.stringify({ code: 500 }));

    expect(capturedLine).toContain("Critical failure in Rust module");
  });
});