---
title: Build from source
lede: The same komorebi.exe, built on your own PC.
description: Build Komorebi on Windows with Rust and the Visual Studio Build Tools in three commands, and run the checks the project runs.
---

1. Install [Rust](https://rustup.rs) and the Visual Studio Build Tools with **Desktop development with C++**. That brings the Windows SDK and `fxc.exe`.
2. Run `git clone https://github.com/RusticStack/komorebi`.
3. In the `komorebi` folder, run `cargo build --release --locked -p komorebi-gpui`.

Start `.\target\release\komorebi.exe`. It is one file and uses the same data folder as the installed app. rustup picks the pinned toolchain. The app is the `komorebi-gpui` package; the root package is the library under it.

> **Try it on a throwaway cache.** Set `$env:KOMOREBI_OFFLINE = 1` and point `$env:KOMOREBI_DB` at a new file in `%TEMP%` before you start it, so your own mail is not touched.

<details>
<summary>The checks CI runs</summary>

```powershell
cargo xtask check
cargo test --locked --workspace
cargo deny --workspace --locked check licenses advisories
```

`cargo xtask check` runs the formatting check, clippy, the tests, the project's lints and, after a release build, the size check.

</details>

Before you send a change, read [CONTRIBUTING.md](https://github.com/RusticStack/komorebi/blob/main/CONTRIBUTING.md) and the [scope and non-goals](https://github.com/RusticStack/komorebi/blob/main/docs/SCOPE.md).
