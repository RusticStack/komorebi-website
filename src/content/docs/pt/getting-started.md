---
title: Instalar o Komorebi
lede: Alguns minutos. Precisa do Windows 10 ou 11, 64 bits.
description: Transfira o Komorebi, confirme o SHA-256 do instalador, instale-o para o seu utilizador do Windows e passe o aviso do SmartScreen.
---

1. **Transfira o instalador.** Use o botão da [página de transferência](/pt/download), que também mostra o SHA-256 do instalador.
2. **Confirme o ficheiro.** No PowerShell, na pasta da transferência, execute `(Get-FileHash .\komorebi-<versão>-setup.exe).Hash.ToLower()`. O resultado tem de ser igual ao SHA-256 da página de transferência.
3. **Execute-o.** Instala só para o seu utilizador do Windows, em `%LOCALAPPDATA%\Programs\Komorebi`, sem direitos de administrador.
4. **Abra o Komorebi.** O ecrã de boas-vindas propõe [adicionar a primeira conta](/pt/docs/adding-an-account).

> **Se o Windows protegeu o seu PC**
> O instalador ainda não tem assinatura de código, por isso o SmartScreen pode mostrar um aviso na primeira vez. Depois de confirmar o hash, escolha **Mais informações** e depois **Executar mesmo assim**.

## Outras formas de instalar

- A primeira página do instalador pode instalar para todos os utilizadores. Isso pede direitos de administrador e usa `Program Files\Komorebi`.
- `/SILENT` ou `/VERYSILENT` instalam sem perguntas.

## Desinstalar

Use Definições do Windows > Aplicações. O desinstalador pergunta se também deve apagar `%LOCALAPPDATA%\komorebi`; Não é a predefinição. As palavras-passe guardadas ficam no Gestor de Credenciais até [remover os seus dados](/pt/docs/remove-your-data) dentro do Komorebi.
