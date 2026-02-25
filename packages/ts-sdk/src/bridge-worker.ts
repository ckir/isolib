// bridge-worker.ts
import { registerCallback } from "./connections/bridge-connector";
import { normalizeLevel } from "./util/levels";

function isValidEvent(obj: any) {
  return obj && typeof obj.timestamp === "number" && typeof obj.level === "string" && typeof obj.app === "string" && typeof obj.message === "string";
}

function handleLine(line: string) {
  try {
    const obj = JSON.parse(line);
    if (!isValidEvent(obj)) {
      console.warn("Invalid event shape:", line);
      return;
    }
    obj.level = normalizeLevel(obj.level);
    obj.env = obj.env || process.env.NODE_ENV || "development";
    obj.version = obj.version || process.env.ISOLIB_VERSION || null;
    console.log(JSON.stringify(obj));
  } catch (err) {
    console.warn("Failed to parse line:", err);
  }
}

registerCallback((line) => {
  handleLine(line);
});
