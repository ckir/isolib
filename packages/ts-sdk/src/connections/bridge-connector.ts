// connections/bridge-connector.ts
type BridgeCallback = (line: string) => void;

let _callback: BridgeCallback | null = null;

export function registerCallback(cb: BridgeCallback) {
  _callback = cb;
}

export function sendLine(line: string) {
  if (_callback) {
    try {
      _callback(line);
    } catch (err) {
      console.error("bridge callback error:", err);
    }
  } else {
    process.stderr.write(line + "\n");
  }
}
