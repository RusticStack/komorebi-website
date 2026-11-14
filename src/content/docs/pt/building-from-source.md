---
title: Compilar a partir do código
lede: O mesmo komorebi.exe, compilado no seu PC.
description: Compile o Komorebi 1.0 no Windows com Rust e as Visual Studio Build Tools, e corra as verificações que o projeto corre.
---

1. **Instale as ferramentas:** [Rust](https://rustup.rs) e as Visual Studio Build Tools com **Desenvolvimento para desktop com C++**, que trazem o SDK do Windows e o seu compilador de shaders, o `fxc.exe`. O rustup escolhe a toolchain fixada.
2. **Obtenha o código.** Execute `git clone https://github.com/RusticStack/komorebi`.
3. **Compile.** Execute `cargo build --release --locked -p komorebi-gpui` na pasta `komorebi`. A aplicação é o pacote `komorebi-gpui`; o pacote da raiz da pasta é a biblioteca por baixo dela.
4. **Abra-o.** Execute `.\target\release\komorebi.exe`. É um único ficheiro e usa a mesma pasta de dados que a aplicação instalada.

> **Experimente numa cache descartável**
> Para experimentar uma compilação sem tocar no seu correio, defina `$env:KOMOREBI_OFFLINE = 1` e aponte `$env:KOMOREBI_DB` para um ficheiro novo em `%TEMP%` antes de a abrir.

## As verificações da CI

```powershell
cargo xtask check
cargo test --locked --workspace
cargo deny --workspace --locked check licenses advisories
```

O `cargo xtask check` corre a verificação da formatação, o clippy, os testes, as verificações próprias do projeto e, depois de uma compilação de lançamento, a verificação do tamanho.

Antes de enviar uma alteração, leia o [CONTRIBUTING.md](https://github.com/RusticStack/komorebi/blob/main/CONTRIBUTING.md) e o [âmbito e o que fica de fora](https://github.com/RusticStack/komorebi/blob/main/docs/SCOPE.md).
