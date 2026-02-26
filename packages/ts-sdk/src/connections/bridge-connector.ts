import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export class BridgeConnector {
    private isBun: boolean;
    private nativeModule: any = null;

    constructor() {
        this.isBun = typeof (process as any)?.versions?.bun !== 'undefined';
        this.initNative();
    }

    private initNative() {
        try {
            // Absolute path resolution for Vitest compatibility
            const nativePath = join(__dirname, '..', 'native', 'index.node');
            
            this.nativeModule = require(nativePath);
            
            // Health Check: Verify expected exports exist
            if (this.nativeModule && typeof this.nativeModule.log_from_rust !== 'function') {
                console.error("❌ [isolib] Native module loaded but 'log_from_rust' is missing!");
                console.error("📦 Available exports:", Object.keys(this.nativeModule));
            } else {
                const runtime = this.isBun ? "Bun" : "Node";
                console.log(`🚀 [isolib] Bridge initialized using ${runtime} runtime`);
            }
        } catch (err) {
            console.error("❌ [isolib] Failed to load native bridge at:", join(__dirname, '..', 'native', 'index.node'));
            console.error("👉 Run Cockpit Option 3 to generate the binary.");
        }
    }

    public getNative() {
        return this.nativeModule;
    }

    public sendToRust(level: string, msg: string, extras: string) {
        if (!this.nativeModule?.log_from_rust) return;
        try {
            this.nativeModule.log_from_rust(level, msg, extras);
        } catch (err) {
            console.error("error calling Rust bridge:", err);
        }
    }
}

export const bridgeConnector = new BridgeConnector();
export function registerCallback(cb: (line: string) => void) { /* ... */ }
export function sendLine(line: string) { /* ... */ }