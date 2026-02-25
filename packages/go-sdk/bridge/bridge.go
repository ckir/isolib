package main

/*
#include <stdlib.h>
*/
import "C"
import (
    "fmt"
)

//export IsolibGuestSendLine
func IsolibGuestSendLine(cstr *C.char) {
    if cstr == nil {
        return
    }
    goStr := C.GoString(cstr)
    fmt.Println(goStr)
}

func main() {
    // For `go run` convenience
}
