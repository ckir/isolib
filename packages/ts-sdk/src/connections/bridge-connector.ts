import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/**
 * ISOLIB Bridge Connector
 * Dual-Runtime Support: Bun | Node (Standard N-API)
 * * This class manages the connection between the TypeScript host and the 
 * Rust guest. It autodetects the runtime to handle FFI loading correctly.
 */
export class BridgeConnector {
    private isBun: boolean;
    private nativeModule: any = null;

    constructor() {
        // Detect if running under Bun or Node.js
        this.isBun = typeof (process as any)?.versions?.bun !== 'undefined';
        this.initNative();
    }

    /**
     * Dynamically loads the native bridge artifact.
     * Uses require for .node compatibility across both runtimes.
     */
    private initNative() {
        try {
            // Path relative to the compiled JS in dist/connections/
            const nativePath = '../native/index.node';
            
            this.nativeModule = require(nativePath);
            
            const runtimeName = this.isBun ? "Bun" : "Node";
            console.log(`🚀 [isolib] Bridge initialized using ${runtimeName} runtime`); 
        } catch (err) {
            console.error("❌ [isolib] Failed to load native bridge. Did you run Cockpit Option 3?"); 
        }
    }

    /**
     * Forwards log data to the Rust guest SDK.
     * @param level - Pino log level
     * @param msg - The log message
     * @param app - Source application name
     */
    public sendToRust(level: string, msg: string, app: string) {
        if (!this.nativeModule) return;
        
        try {
            const result = this.nativeModule.logEvent(level, msg, app); 
            console.log(result); 
        } catch (err) {
            console.error("error calling Rust bridge:", err);
        }
    }
}

// Global state for internal SDK communication
const instance = new BridgeConnector();
let globalCallback: ((line: string) => void) | null = null;

/**
 * Registers a callback for the bridge worker to process lines.
 */
export function registerCallback(callback: (line: string) => void) {
    globalCallback = callback;
}

/**
 * Sends a raw string (usually JSON) through the bridge system.
 */
export function sendLine(line: string) {
    if (globalCallback) {
        globalCallback(line);
    }
}