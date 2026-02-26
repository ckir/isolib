/**
 * ISOLIB Bridge Worker
 * Responsible for receiving raw log lines from the FFI bridge, 
 * validating their schema, and routing them to the standard output.
 */

// Added explicit .js extensions to satisfy NodeNext ESM resolution 
import { registerCallback } from "./connections/bridge-connector.js";
import { normalizeLevel } from "./util/levels.js";

/**
 * Validates that an object matches the mandatory ISOLIB schema.
 * @param obj - The object to validate
 */
function isValidEvent(obj: any): boolean {
  return (
    obj &&
    typeof obj.timestamp === "number" &&
    typeof obj.level === "string" &&
    typeof obj.app === "string" &&
    typeof obj.message === "string"
  );
}

/**
 * Parses a JSON string, performs normalization, and outputs the result.
 * @param line - The raw string received from the guest SDK
 */
function handleLine(line: string): void {
  try {
    const obj = JSON.parse(line);

    if (!isValidEvent(obj)) {
      console.warn("Invalid event shape:", line);
      return;
    }

    // Normalize pino-style log levels 
    obj.level = normalizeLevel(obj.level);
    
    // Default metadata injection
    obj.env = obj.env || process.env.NODE_ENV || "development";
    obj.version = obj.version || process.env.ISOLIB_VERSION || null;

    // Route the finalized event to stdout
    console.log(JSON.stringify(obj));
  } catch (err) {
    console.warn("Failed to parse line:", err);
  }
}

/**
 * Subscribes to the bridge connector's global callback.
 * Explicitly typed 'line' as string to resolve TS7006.
 */
registerCallback((line: string) => {
  handleLine(line);
});