import { describe, it, expect, vi } from "vitest";
import { bridgeConnector } from "../../src/connections/bridge-connector.js";
import "../../src/core/singleton.js";

describe("Rust-to-TS Bridge", () => {
  it("should capture Rust logs in the TS singleton", () => {
    const logSpy = vi.spyOn(globalThis.isolibLogger, 'log');
    const native = bridgeConnector.getNative();

    // Guard against uninitialized or broken native module
    if (!native || typeof native.log_from_rust !== 'function') {
        throw new Error("FFI Failure: log_from_rust not found on native module. Check Rust build.");
    }

    native.log_from_rust("info", "Hello from Rust!", JSON.stringify({ threadId: 1 }));

    expect(logSpy).toHaveBeenCalledWith(
      "info",
      "Hello from Rust!",
      expect.objectContaining({ threadId: 1 })
    );
  });
});