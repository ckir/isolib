/**
 * ISOLIB Core Logger
 * A lightweight logger used for internal SDK bootstrapping and early-phase logging.
 * This logger bypasses the FFI bridge and writes directly to process.stderr.
 */
import { epochMs } from "../util/time.js"; // Explicit extension for Node ESM
import { normalizeLevel } from "../util/levels.js";
// Default app name derived from environment or process directory
const appName = process.env.ISOLIB_APP || process.cwd().split(/[\\/]/).pop() || "isolib-app";
/**
 * Internal helper to create a canonical log event following the project schema.
 */
function makeEvent(level, message, extras) {
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
    trace(message, opts) {
        const ev = makeEvent("trace", message, opts?.extras);
        process.stderr.write(JSON.stringify(ev) + "\n");
    },
    debug(message, opts) {
        const ev = makeEvent("debug", message, opts?.extras);
        process.stderr.write(JSON.stringify(ev) + "\n");
    },
    info(message, opts) {
        const ev = makeEvent("info", message, opts?.extras);
        process.stderr.write(JSON.stringify(ev) + "\n");
    },
    warn(message, opts) {
        const ev = makeEvent("warn", message, opts?.extras);
        process.stderr.write(JSON.stringify(ev) + "\n");
    },
    error(message, opts) {
        const ev = makeEvent("error", message, opts?.extras);
        process.stderr.write(JSON.stringify(ev) + "\n");
    },
    fatal(message, opts) {
        const ev = makeEvent("fatal", message, opts?.extras);
        process.stderr.write(JSON.stringify(ev) + "\n");
    }
};
