// util/levels.ts
export const PINO_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace"];
export function normalizeLevel(level) {
    if (!level)
        return "info";
    const l = String(level).toLowerCase();
    if (PINO_LEVELS.includes(l))
        return l;
    return "info";
}
export function levelPriority(level) {
    const order = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };
    return order[level] ?? 3;
}
