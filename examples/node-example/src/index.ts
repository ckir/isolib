import "../../../packages/ts-sdk/src/core/singleton.js";
import { LoggerBuilder } from "../../../packages/ts-sdk/src/loggers/builder.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const native = require("../../../packages/ts-sdk/dist/native/index.node");

// 1. Bootstrap
globalThis.isolibLogger.log("info", "TS Host Booting...");

// 2. Log from Rust before upgrade (will use coreLogger + buffer)
native.log_from_rust("debug", "Rust initializing...", JSON.stringify({ guest: "rust" }));

// 3. Upgrade TS Logger
const mainLogger = new LoggerBuilder()
    .with_rotating_files({ path: "./logs/polyglot.log" })
    .build();
globalThis.isolibLogger.upgrade(mainLogger);

// 4. Log from Rust after upgrade (will go straight to pino-roll)
native.log_from_rust("info", "Rust now logging to rotating files!", JSON.stringify({ status: "active" }));