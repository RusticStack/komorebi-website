---
title: Compilar a partir do código
lede: O mesmo komorebi.exe, compilado no seu PC.
description: Compile o Komorebi no Windows com Rust e as Visual Studio Build Tools em três comandos, e corra as verificações que o projeto corre.
---

1. Instale o [Rust](https://rustup.rs) e as Visual Studio Build Tools com **Desenvolvimento para desktop com C++**. Trazem o SDK do Windows e o `fxc.exe`.
2. Execute `git clone https://github.com/RusticStack/komorebi`.
3. Na pasta `komorebi`, execute `cargo build --release --locked -p komorebi-gpui`.

Abra `.\target\release\komorebi.exe`. É um único ficheiro e usa a mesma pasta de dados que a aplicação instalada. O rustup escolhe a toolchain fixada. A aplicação é o pacote `komorebi-gpui`; o pacote da raiz é a biblioteca por baixo dela.

> **Experimente numa cache descartável.** Defina `$env:KOMOREBI_OFFLINE = 1` e aponte `$env:KOMOREBI_DB` para um ficheiro novo em `%TEMP%` antes de a abrir, para não tocar no seu correio.

<details>
<summary>As verificações da CI</summary>

```powershell
cargo xtask check
cargo test --locked --workspace
cargo deny --workspace --locked check licenses advisories
```

O `cargo xtask check` corre a verificação da formatação, o clippy, os testes, as verificações próprias do projeto e, depois de uma compilação de lançamento, a verificação do tamanho.

</details>

Antes de enviar uma alteração, leia o [CONTRIBUTING.md](https://github.com/RusticStack/komorebi/blob/main/CONTRIBUTING.md) e o [âmbito e o que fica de fora](https://github.com/RusticStack/komorebi/blob/main/docs/SCOPE.md).
