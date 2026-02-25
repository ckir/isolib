// src/lib.rs
use std::ffi::CStr;
use std::os::raw::c_char;

#[no_mangle]
pub extern "C" fn isolib_guest_send_line(line: *const c_char) {
    if line.is_null() {
        return;
    }
    unsafe {
        let cstr = CStr::from_ptr(line);
        if let Ok(s) = cstr.to_str() {
            println!("{}", s);
        }
    }
}
