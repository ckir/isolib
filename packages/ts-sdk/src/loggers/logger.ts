// loggers/logger.ts
import { sendLine } from "../connections/bridge-connector";
import { normalizeLevel } from "../util/levels";

export type LoggerOpts = {
  extras?: Record<string, any>;
};

export function createLogger() {
  return {
    trace(message: string, opts?: LoggerOpts) {
      const ev = {
        timestamp: Date.now(),
        level: normalizeLevel("trace"),
        app: process.env.ISOLIB_APP || "isolib-app",
        message,
        extras: opts?.extras ?? {}
      };
      sendLine(JSON.stringify(ev));
    },
    debug(message: string, opts?: LoggerOpts) {
      const ev = {
        timestamp: Date.now(),
        level: normalizeLevel("debug"),
        app: process.env.ISOLIB_APP || "isolib-app",
        message,
        extras: opts?.extras ?? {}
      };
      sendLine(JSON.stringify(ev));
    },
    info(message: string, opts?: LoggerOpts) {
      const ev = {
        timestamp: Date.now(),
        level: normalizeLevel("info"),
        app: process.env.ISOLIB_APP || "isolib-app",
        message,
        extras: opts?.extras ?? {}
      };
      sendLine(JSON.stringify(ev));
    },
    warn(message: string, opts?: LoggerOpts) {
      const ev = {
        timestamp: Date.now(),
        level: normalizeLevel("warn"),
        app: process.env.ISOLIB_APP || "isolib-app",
        message,
        extras: opts?.extras ?? {}
      };
      sendLine(JSON.stringify(ev));
    },
    error(message: string, opts?: LoggerOpts) {
      const ev = {
        timestamp: Date.now(),
        level: normalizeLevel("error"),
        app: process.env.ISOLIB_APP || "isolib-app",
        message,
        extras: opts?.extras ?? {}
      };
      sendLine(JSON.stringify(ev));
    },
    fatal(message: string, opts?: LoggerOpts) {
      const ev = {
        timestamp: Date.now(),
        level: normalizeLevel("fatal"),
        app: process.env.ISOLIB_APP || "isolib-app",
        message,
        extras: opts?.extras ?? {}
      };
      sendLine(JSON.stringify(ev));
    }
  };
}

export const logger = createLogger();
