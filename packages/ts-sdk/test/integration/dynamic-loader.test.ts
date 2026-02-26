import { describe, it, expect } from "vitest";
import { LoggerBuilder } from "../../src/loggers/builder.js";

describe("Dynamic Plugin Loader", () => {
  it("should assemble multiple transport targets including rotation", () => {
    const builder = new LoggerBuilder()
      .with_rotating_files({ path: './logs/app.log', size: '5m' })
      .with_custom_plugin('my-custom-plugin', { apiKey: '123' });

    const logger = builder.build();
    expect(logger).toBeDefined();
    // Pino handles the worker thread spawning internally
  });
});