// test/integration/bridge-host.test.ts
import { describe, it, expect } from "vitest";
import { registerCallback, sendLine } from "../../src/connections/bridge-connector";

describe("bridge host integration", () => {
  it("accepts a line and invokes callback", (done) => {
    registerCallback((line) => {
      const obj = JSON.parse(line);
      expect(obj.level).toBe("info");
      expect(obj.message).toBe("test");
      done();
    });

    const ev = {
      timestamp: Date.now(),
      level: "info",
      app: "isolib-app",
      message: "test",
      extras: {}
    };
    sendLine(JSON.stringify(ev));
  });
});
