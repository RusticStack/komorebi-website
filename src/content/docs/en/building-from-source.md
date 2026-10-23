---
title: Build from source
lede: The same komorebi.exe, built on your own PC.
description: Build Komorebi yourself on Windows with Rust and the Visual Studio Build Tools, and run the project's checks.
---

1. **Install the tools:** [Rust](https://rustup.rs) and the Visual Studio Build Tools with **Desktop development with C++**. rustup picks the pinned toolchain.
2. **Get the code.** Run `git clone https://github.com/RusticStack/komorebi`.
3. **Build it.** Run `cargo build --release --locked` in the `komorebi` folder.
4. **Run it.** Start `.\target\release\komorebi.exe`. It is a single file and uses the same data folder as the installed app.

## The checks CI runs

```powershell
cargo fmt --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

Before you send a change, read [CONTRIBUTING.md](https://github.com/RusticStack/komorebi/blob/main/CONTRIBUTING.md) and the [scope and non-goals](https://github.com/RusticStack/komorebi/blob/main/docs/SCOPE.md).
