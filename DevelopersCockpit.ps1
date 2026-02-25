# ==============================================================================
# ISOLIB DEVELOPER COCKPIT
# Unified Orchestrator for TS Host, Rust Guest, and Go Guest
# ==============================================================================

function Show-Menu {
    Clear-Host
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "             ISOLIB DEVELOPER COCKPIT           " -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host " 1. [Setup]  Check & Install Dependencies"
    Write-Host " 2. [Build]  TypeScript SDK (Host)"
    Write-Host " 3. [Build]  Rust SDK (Guest - Shared Lib)"
    Write-Host " 4. [Build]  Go SDK (Guest - C-Shared)"
    Write-Host " 5. [Test]   Run Guest SDK Tests (Rust & Go)"
    Write-Host " 6. [Test]   Run TS Tests (Vitest)"
    Write-Host " 7. [Run]    Launch Node Example App"
    Write-Host " 8. [Clean]  Wipe Build Artifacts & Node Modules"
    Write-Host " 9. [Lint]   Run Polyglot Linter (TS, Rust, Go)"
    Write-Host " V. [Verify] Check FFI Binary Status"
    Write-Host "------------------------------------------------"
    Write-Host " Q. Quit"
    Write-Host "================================================"
}

function Wait-User {
    Write-Host "`nPress Enter to return to menu..." -ForegroundColor Gray
    Read-Host
}

function Check-Dependencies {
    Write-Host "--- Auditing Environment ---" -ForegroundColor Yellow
    
    # TypeScript
    if (Get-Command pnpm -ErrorAction SilentlyContinue) { 
        Write-Host "[TS] pnpm found. Syncing workspace..." -ForegroundColor Green
        Set-Location "$PSScriptRoot/packages/ts-sdk"
        pnpm install
        Set-Location $PSScriptRoot 
    } else { Write-Host "[TS] Error: pnpm not found." -ForegroundColor Red }

    # Rust
    if (Get-Command cargo -ErrorAction SilentlyContinue) { 
        Write-Host "[Rust] Cargo found." -ForegroundColor Green
    } else { Write-Host "[Rust] Error: Rust/Cargo not found." -ForegroundColor Red }

    # Go
    if (Get-Command go -ErrorAction SilentlyContinue) { 
        Write-Host "[Go] Go found." -ForegroundColor Green
        Set-Location "$PSScriptRoot/packages/go-sdk"
        go mod tidy
        Set-Location $PSScriptRoot
    } else { Write-Host "[Go] Error: Go not found." -ForegroundColor Red }
    Wait-User
}

function Build-Rust {
    Write-Host "--- Building Rust Guest (CDYLIB) ---" -ForegroundColor Magenta
    Set-Location "$PSScriptRoot/packages/rust-sdk"
    cargo build --release
    
    # Orchestration: Move to TS-SDK dist for bridge consumption
    $binDir = "$PSScriptRoot/packages/ts-sdk/dist/bin"
    if (-not (Test-Path $binDir)) { New-Item -ItemType Directory -Path $binDir -Force }
    
    Copy-Item "target/release/*.dll", "target/release/*.so", "target/release/*.dylib" -Destination $binDir -ErrorAction SilentlyContinue
    
    Set-Location $PSScriptRoot
    Write-Host "Success: Rust artifacts moved to ts-sdk/dist/bin" -ForegroundColor Green
    Wait-User
}

function Build-Go {
    Write-Host "--- Building Go Guest (C-Shared) ---" -ForegroundColor Blue
    Set-Location "$PSScriptRoot/packages/go-sdk/bridge"
    
    $binDir = "$PSScriptRoot/packages/ts-sdk/dist/bin"
    if (-not (Test-Path $binDir)) { New-Item -ItemType Directory -Path $binDir -Force }

    $outputName = if ($IsWindows) { "libisolib_go.dll" } else { "libisolib_go.so" }

    # Go requires CGO_ENABLED=1 for c-shared mode
    $env:CGO_ENABLED=1
    go build -o "$binDir/$outputName" -buildmode=c-shared bridge.go
    
    Set-Location $PSScriptRoot
    Write-Host "Success: Go library generated in ts-sdk/dist/bin" -ForegroundColor Green
    Wait-User
}

function Run-Linter {
    Write-Host "--- Running Polyglot Linting Pass ---" -ForegroundColor Yellow
    
    Write-Host "[TS] Running ESLint..." -ForegroundColor Cyan
    Set-Location "$PSScriptRoot/packages/ts-sdk"
    pnpm run lint -ErrorAction SilentlyContinue
    
    Write-Host "[Rust] Running Clippy..." -ForegroundColor Magenta
    Set-Location "$PSScriptRoot/packages/rust-sdk"
    cargo clippy -- -D warnings
    
    Write-Host "[Go] Running Go Vet..." -ForegroundColor Blue
    Set-Location "$PSScriptRoot/packages/go-sdk"
    go vet ./...
    
    Set-Location $PSScriptRoot
    Wait-User
}

function Verify-Artifacts {
    Write-Host "--- Verifying FFI Binaries ---" -ForegroundColor Yellow
    $binDir = "$PSScriptRoot/packages/ts-sdk/dist/bin"
    if (Test-Path $binDir) {
        Get-ChildItem -Path $binDir -Include *.dll, *.so, *.dylib, *.h | Select-Object Name, Length
    } else {
        Write-Host "Bin directory not found. Build guests first." -ForegroundColor Red
    }
    Wait-User
}

function Clean-Project {
    Write-Host "--- Deep Cleaning Workspace ---" -ForegroundColor Red
    $targets = @(
        "packages/ts-sdk/node_modules",
        "packages/ts-sdk/dist",
        "packages/rust-sdk/target",
        "examples/node-example/node_modules",
        "examples/node-example/dist"
    )
    foreach ($t in $targets) {
        $path = Join-Path $PSScriptRoot $t
        if (Test-Path $path) { 
            Remove-Item -Recurse -Force $path
            Write-Host "Wiped: $t" 
        }
    }
    # Remove any native artifacts in common paths
    Get-ChildItem -Path $PSScriptRoot -Include *.so,*.dll,*.dylib,*.h -Recurse | Remove-Item -Force
    Wait-User
}

# Main Loop
do {
    Show-Menu
    $choice = (Read-Host "Select Option").ToUpper()
    switch ($choice) {
        '1' { Check-Dependencies }
        '2' { Set-Location "$PSScriptRoot/packages/ts-sdk"; pnpm build; Set-Location $PSScriptRoot; Wait-User }
        '3' { Build-Rust }
        '4' { Build-Go }
        '5' { 
            Write-Host "[Rust Tests]" -ForegroundColor Magenta; Set-Location "$PSScriptRoot/packages/rust-sdk"; cargo test
            Write-Host "[Go Tests]" -ForegroundColor Blue; Set-Location "$PSScriptRoot/packages/go-sdk"; go test ./...
            Set-Location $PSScriptRoot; Wait-User 
        }
        '6' { Set-Location "$PSScriptRoot/packages/ts-sdk"; pnpm test; Set-Location $PSScriptRoot; Wait-User }
        '7' { Set-Location "$PSScriptRoot/examples/node-example"; pnpm start; Set-Location $PSScriptRoot; Wait-User }
        '8' { Clean-Project }
        '9' { Run-Linter }
        'V' { Verify-Artifacts }
    }
} while ($choice -ne 'Q')