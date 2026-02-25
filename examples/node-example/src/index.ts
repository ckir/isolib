// examples/node-example/src/index.ts
import { coreLogger } from "../../../packages/ts-sdk/src/core/coreLogger";
import { logger } from "../../../packages/ts-sdk/src/loggers/logger";

console.log("Starting node example...");

coreLogger.info("Booting (core logger)");
logger.info("Hello from configured logger", { extras: { userId: "u123" } });
