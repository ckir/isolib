Remove-Item "isolib.txt" -ErrorAction SilentlyContinue
dir-to-text --use-gitignore -e "target" -e "Cargo.lock" -e .git .
