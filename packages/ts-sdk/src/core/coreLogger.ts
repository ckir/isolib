/**
 * ISOLIB Core Logger
 * A lightweight logger used for internal SDK bootstrapping and early-phase logging.
 * This logger bypasses the FFI bridge and writes directly to process.stderr.
 */

import { epochMs } from "../util/time.js"; // Explicit extension for Node ESM
import { normalizeLevel } from "../util/levels.js";

export type CoreLogOpts = {
  extras?: Record<string, any>;
};

// Default app name derived from environment or process directory
const appName = process.env.ISOLIB_APP || process.cwd().split(/[\\/]/).pop() || "isolib-app"; 

/**
 * Internal helper to create a canonical log event following the project schema.
 */
function makeEvent(level: string, message: string, extras?: Record<string, any>) {
  const lvl = normalizeLevel(level);
  return {
    timestamp: epochMs(),
    level: lvl,
    app: appName,
    message,
    extras: extras ?? {}
  };
}

/**
 * Core Logger implementation exporting all pino-compatible levels.
 */
export const coreLogger = {
  trace(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("trace", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  debug(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("debug", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  info(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("info", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  warn(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("warn", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  error(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("error", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  fatal(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("fatal", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  }
};