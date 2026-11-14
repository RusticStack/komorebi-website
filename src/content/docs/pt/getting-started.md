---
title: Instalar o Komorebi
lede: O Komorebi no seu PC em cerca de dois minutos.
description: Instale o Komorebi no Windows 10 ou 11 (64 bits) em poucos cliques, ou descompacte a cópia portátil, e passe o aviso do SmartScreen.
---

1. Prima **Transferir para Windows** na [página de transferência](/pt/download).
2. Execute o instalador. Não precisa de direitos de administrador.
3. Prima **Adicionar a sua conta de e-mail**. Depois [adicione a sua conta](/pt/docs/adding-an-account).

> **Se o Windows protegeu o seu PC.** O instalador ainda não tem assinatura de código, por isso o SmartScreen pode mostrar um aviso na primeira vez. Confirme o ficheiro (abaixo), escolha **Mais informações** e depois **Executar mesmo assim**.

<details>
<summary>Confirme primeiro o ficheiro</summary>

- No PowerShell, na pasta da transferência, execute `(Get-FileHash .\komorebi-<versão>-setup.exe).Hash.ToLower()`.
- O resultado tem de ser igual ao SHA-256 da página de transferência e à linha desse ficheiro no `SHA256SUMS` da versão.

</details>

<details>
<summary>Outras formas de instalar</summary>

- **Zip portátil.** O `komorebi-<versão>-portable-x64.zip` traz o `komorebi.exe`. Descompacte-o onde quiser e execute-o. Guarda os dados em `%LOCALAPPDATA%\komorebi`, tal como a aplicação instalada.
- **Para todos os utilizadores.** A primeira página do instalador, ou `/ALLUSERS`, instala em `Program Files\Komorebi`. Isso pede direitos de administrador.
- **Sem perguntas.** `/SILENT` ou `/VERYSILENT`. Um Komorebi aberto é fechado primeiro e volta a abrir no fim.

</details>

<details>
<summary>Vindo da versão 0.7</summary>

Instale por cima. As contas, o correio, as regras, os contactos e as definições passam para a nova versão.

</details>

## Desinstalar

Use Definições do Windows > Aplicações. O desinstalador pergunta se também deve apagar `%LOCALAPPDATA%\komorebi`; Não é a predefinição. As palavras-passe guardadas ficam até [remover os seus dados](/pt/docs/remove-your-data).
