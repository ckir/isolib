// test/unit/core.test.ts
import { describe, it, expect } from "vitest";
import { coreLogger } from "../../src/core/coreLogger";

describe("coreLogger", () => {
  it("exposes methods", () => {
    expect(typeof coreLogger.info).toBe("function");
    expect(typeof coreLogger.error).toBe("function");
    expect(typeof coreLogger.debug).toBe("function");
  });
});
