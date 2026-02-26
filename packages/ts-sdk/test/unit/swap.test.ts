// packages/ts-sdk/test/unit/swap.test.ts
import { describe, it, expect, vi } from 'vitest';
import { isolibLogger } from '../../src/core/singleton.js';

describe("Logger Swap", () => {
  it("should buffer and replay logs", () => {
    isolibLogger.reset();
    const mockPino = {
      info: vi.fn(),
    };

    isolibLogger.log("info", "buffered message");
    isolibLogger.upgrade(mockPino);

    // Replay logic in upgrade() now satisfies this expectation
    expect(mockPino.info).toHaveBeenCalledWith(expect.anything(), "buffered message");
  });
});