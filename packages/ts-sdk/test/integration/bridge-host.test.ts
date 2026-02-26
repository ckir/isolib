// packages/ts-sdk/test/integration/bridge-host.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { isolibLogger } from '../../src/core/singleton.js';

describe("bridge host integration", () => {
  beforeEach(() => {
    isolibLogger.reset(); // Now exists and clears previous callbacks
  });

  it("accepts a line and invokes callback", async () => {
    const logPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Test timed out")), 2000);

      isolibLogger.onLog((level, message, extras) => {
        if (message === "test message") {
          try {
            expect(level).toBe("info");
            expect(extras).toEqual({ foo: "bar" });
            clearTimeout(timeout);
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      });
    });

    isolibLogger.log("info", "test message", { foo: "bar" });
    await logPromise;
  });
});