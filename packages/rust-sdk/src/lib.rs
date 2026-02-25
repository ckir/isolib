use napi_derive::napi;

#[napi]
pub fn log_event(level: String, message: String, app: String) -> String {
    // This is where your core Rust logging logic lives
    format!("[Rust Guest] {}: {} (App: {})", level.to_uppercase(), message, app)
}

#[napi]
pub fn get_status() -> bool {
    true
}