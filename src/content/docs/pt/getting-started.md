---
title: Instalar o Komorebi
lede: Alguns minutos. Precisa do Windows 10 ou 11, 64 bits.
description: Transfira o Komorebi 1.0, confirme o SHA-256, instale-o para o seu utilizador do Windows ou descompacte a cópia portátil, e passe o aviso do SmartScreen.
---

1. **Transfira o instalador.** Use o botão da [página de transferência](/pt/download), que também mostra o SHA-256 do instalador.
2. **Confirme o ficheiro.** No PowerShell, na pasta da transferência, execute `(Get-FileHash .\komorebi-<versão>-setup.exe).Hash.ToLower()`. O resultado tem de ser igual ao SHA-256 da página de transferência e à linha desse ficheiro no `SHA256SUMS` da versão.
3. **Execute-o.** Instala o `komorebi.exe` só para o seu utilizador do Windows, em `%LOCALAPPDATA%\Programs\Komorebi`, sem direitos de administrador, e junta um atalho no menu Iniciar.
4. **Abra o Komorebi.** O ecrã de boas-vindas propõe [adicionar a primeira conta](/pt/docs/adding-an-account).

> **Se o Windows protegeu o seu PC**
> O instalador ainda não tem assinatura de código, por isso o SmartScreen pode mostrar um aviso na primeira vez. Depois de confirmar o hash, escolha **Mais informações** e depois **Executar mesmo assim**.

## Outras formas de instalar

- **O zip portátil.** O `komorebi-<versão>-portable-x64.zip` traz o `komorebi.exe` com a licença, a declaração de privacidade e o registo de alterações. Descompacte-o onde quiser e execute-o; guarda os dados em `%LOCALAPPDATA%\komorebi`, tal como a aplicação instalada.
- **Para todos os utilizadores.** A primeira página do instalador, ou `/ALLUSERS`, instala em `Program Files\Komorebi`. Isso pede direitos de administrador.
- **Sem perguntas.** `/SILENT` ou `/VERYSILENT` instalam sem perguntar; um Komorebi aberto é fechado primeiro e volta a abrir no fim.

## Vindo da versão 0.7

Instale a 1.0 por cima da 0.7, ou deixe que Definições > Acerca de a atualize. As contas, a cache de correio, as regras, os contactos e as definições passam para a nova versão, e nada é transferido de novo. Na primeira vez, a janela abre no sítio predefinido.

## Desinstalar

Use Definições do Windows > Aplicações. O desinstalador pergunta se também deve apagar `%LOCALAPPDATA%\komorebi`; Não é a predefinição. As palavras-passe guardadas ficam no Gestor de Credenciais até [remover os seus dados](/pt/docs/remove-your-data) dentro do Komorebi.
