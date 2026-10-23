---
title: Compilar a partir do código
lede: O mesmo komorebi.exe, compilado no seu PC.
description: Compile o Komorebi no Windows com Rust e as Visual Studio Build Tools, e corra as verificações do projeto.
---

1. **Instale as ferramentas:** [Rust](https://rustup.rs) e as Visual Studio Build Tools com **Desenvolvimento para desktop com C++**. O rustup escolhe a toolchain fixada.
2. **Obtenha o código.** Execute `git clone https://github.com/RusticStack/komorebi`.
3. **Compile.** Execute `cargo build --release --locked` na pasta `komorebi`.
4. **Abra-o.** Execute `.\target\release\komorebi.exe`. É um único ficheiro e usa a mesma pasta de dados que a aplicação instalada.

## As verificações da CI

```powershell
cargo fmt --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

Antes de enviar uma alteração, leia o [CONTRIBUTING.md](https://github.com/RusticStack/komorebi/blob/main/CONTRIBUTING.md) e o [âmbito e o que fica de fora](https://github.com/RusticStack/komorebi/blob/main/docs/SCOPE.md).
