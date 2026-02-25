// core/coreLogger.ts
import { epochMs } from "../util/time";
import { normalizeLevel } from "../util/levels";

export type CoreLogOpts = {
  extras?: Record<string, any>;
};

const appName = process.env.ISOLIB_APP || process.cwd().split(/[\\/]/).pop() || "isolib-app";

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

export const coreLogger = {
  info(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("info", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  error(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("error", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  },
  debug(message: string, opts?: CoreLogOpts) {
    const ev = makeEvent("debug", message, opts?.extras);
    process.stderr.write(JSON.stringify(ev) + "\n");
  }
};
