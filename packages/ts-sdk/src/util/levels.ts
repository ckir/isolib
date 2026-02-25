// util/levels.ts
export const PINO_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace"] as const;
export type PinoLevel = typeof PINO_LEVELS[number];

export function normalizeLevel(level?: string): PinoLevel {
  if (!level) return "info";
  const l = String(level).toLowerCase();
  if ((PINO_LEVELS as readonly string[]).includes(l)) return l as PinoLevel;
  return "info";
}

export function levelPriority(level: PinoLevel): number {
  const order = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };
  return order[level] ?? 3;
}
