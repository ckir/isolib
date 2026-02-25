import { sendLine } from "../connections/bridge-connector.js";
import { normalizeLevel } from "../util/levels.js";

export type LoggerOpts = {
  extras?: Record<string, any>;
};

export function createLogger() {
  const app = process.env.ISOLIB_APP || "isolib-app";

  return {
    trace(message: string, opts?: LoggerOpts) {
      sendLine(JSON.stringify({
        timestamp: Date.now(),
        level: normalizeLevel("trace"),
        app,
        message,
        extras: opts?.extras ?? {}
      }));
    },
    debug(message: string, opts?: LoggerOpts) {
      sendLine(JSON.stringify({
        timestamp: Date.now(),
        level: normalizeLevel("debug"),
        app,
        message,
        extras: opts?.extras ?? {}
      }));
    },
    info(message: string, opts?: LoggerOpts) {
      sendLine(JSON.stringify({
        timestamp: Date.now(),
        level: normalizeLevel("info"),
        app,
        message,
        extras: opts?.extras ?? {}
      }));
    },
    warn(message: string, opts?: LoggerOpts) {
      sendLine(JSON.stringify({
        timestamp: Date.now(),
        level: normalizeLevel("warn"),
        app,
        message,
        extras: opts?.extras ?? {}
      }));
    },
    error(message: string, opts?: LoggerOpts) {
      sendLine(JSON.stringify({
        timestamp: Date.now(),
        level: normalizeLevel("error"),
        app,
        message,
        extras: opts?.extras ?? {}
      }));
    },
    fatal(message: string, opts?: LoggerOpts) {
      sendLine(JSON.stringify({
        timestamp: Date.now(),
        level: normalizeLevel("fatal"),
        app,
        message,
        extras: opts?.extras ?? {}
      }));
    }
  };
}

export const logger = createLogger();