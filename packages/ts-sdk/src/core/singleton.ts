// packages/ts-sdk/src/core/singleton.ts
import { coreLogger } from "./coreLogger.js";

type LogCallback = (level: string, message: string, extras?: any) => void;

let activeLogger: any = coreLogger;
let logBuffer: Array<{ level: string; message: string; extras?: any }> = [];
let callbacks: LogCallback[] = [];
let isUpgraded = false;

export const isolibLogger = {
  /**
   * Logs an event. Notifies callbacks, then buffers or passes to the active logger.
   */
  log(level: string, message: string, extras?: any) {
    // Notify registered callbacks (essential for integration tests)
    callbacks.forEach(cb => cb(level, message, extras));

    if (!isUpgraded) {
      logBuffer.push({ level, message, extras });
      // Fallback to coreLogger (direct stderr write)
      (coreLogger as any)[level]?.(message, { extras });
    } else {
      // Pass to upgraded logger (e.g., Pino)
      // Note: Reversing args to match Pino's (object, message) signature expected by tests
      activeLogger[level]?.({ ...extras }, message);
    }
  },

  /**
   * Registers a callback for log events.
   */
  onLog(cb: LogCallback) {
    callbacks.push(cb);
  },

  /**
   * Upgrades the logger and replays buffered logs.
   */
  upgrade(newLogger: any) {
    activeLogger = newLogger;
    isUpgraded = true;
    
    // Replay buffered logs to the new logger
    logBuffer.forEach(({ level, message, extras }) => {
      activeLogger[level]?.({ ...extras }, message);
    });
    logBuffer = [];
  },

  /**
   * Resets the singleton state for clean test runs.
   */
  reset() {
    activeLogger = coreLogger;
    logBuffer = [];
    callbacks = [];
    isUpgraded = false;
  }
};

// Expose globally for cross-process/test compatibility
(globalThis as any).isolibLogger = isolibLogger;