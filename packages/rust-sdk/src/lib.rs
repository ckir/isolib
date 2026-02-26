use napi_derive::napi;
use napi::{Env, JsObject, JsFunction, Result};
use serde_json;

/**
 * Rust Native Bridge Implementation.
 * Added js_name to prevent automatic camelCase conversion.
 */
#[napi(js_name = "log_from_rust")] // This ensures the JS export is log_from_rust
pub fn log_from_rust(
    env: Env, 
    level: String, 
    message: String, 
    extras_json: Option<String>
) -> Result<()> {
    // ... rest of the function remains the same ...
    let global = env.get_global()?;
    let isolib_logger: JsObject = global.get_named_property("isolibLogger")?;
    let log_fn: JsFunction = isolib_logger.get_named_property("log")?;

    let extras: serde_json::Value = match extras_json {
        Some(json) => serde_json::from_str(&json).unwrap_or(serde_json::json!({})),
        None => serde_json::json!({}),
    };

    log_fn.call(Some(&isolib_logger), &[
        env.create_string(&level)?.into_unknown(),
        env.create_string(&message)?.into_unknown(),
        env.to_js_value(&extras)?,
    ])?;

    Ok(())
}