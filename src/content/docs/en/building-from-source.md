---
title: Build from source
lede: The same komorebi.exe, built on your own PC.
description: Build Komorebi 1.0 yourself on Windows with Rust and the Visual Studio Build Tools, and run the checks the project runs.
---

1. **Install the tools:** [Rust](https://rustup.rs) and the Visual Studio Build Tools with **Desktop development with C++**, which brings the Windows SDK and its shader compiler, `fxc.exe`. rustup picks the pinned toolchain.
2. **Get the code.** Run `git clone https://github.com/RusticStack/komorebi`.
3. **Build it.** Run `cargo build --release --locked -p komorebi-gpui` in the `komorebi` folder. The app is the `komorebi-gpui` package; the folder's root package is the library under it.
4. **Run it.** Start `.\target\release\komorebi.exe`. It is a single file and uses the same data folder as the installed app.

> **Try it on a throwaway cache**
> To try a build without touching your own mail, set `$env:KOMOREBI_OFFLINE = 1` and point `$env:KOMOREBI_DB` at a new file in `%TEMP%` before you start it.

## The checks CI runs

```powershell
cargo xtask check
cargo test --locked --workspace
cargo deny --workspace --locked check licenses advisories
```

`cargo xtask check` runs the formatting check, clippy, the tests, the project's lints and, after a release build, the size check.

Before you send a change, read [CONTRIBUTING.md](https://github.com/RusticStack/komorebi/blob/main/CONTRIBUTING.md) and the [scope and non-goals](https://github.com/RusticStack/komorebi/blob/main/docs/SCOPE.md).
