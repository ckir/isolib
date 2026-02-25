/**
 * ISOLIB Node.js Example
 */

// Import from the compiled 'dist' directory with .js extensions
import { coreLogger } from "../../../packages/ts-sdk/dist/core/coreLogger.js";
import { logger } from "../../../packages/ts-sdk/dist/loggers/logger.js"; 

console.log("Starting isolib integration example...");

coreLogger.info("Booting (core logger)");
logger.info("Hello from configured logger", { 
    extras: { userId: "u123" } 
});