---
title: Cifrar a cache de correio
lede: Desligado por predefinição. Depois de ativo, só o seu utilizador do Windows a desbloqueia.
description: Cifre a cache local de correio do Komorebi com AES-256-GCM e uma chave protegida pelo Windows, e o que acontece se a chave se perder.
---

1. Abra **Definições > Privacidade**.
2. Ative **Cifrar a cache de correio neste computador** e confirme com **Cifrar no próximo início**.
3. Prima **Reiniciar agora**. Desativar a opção converte a cache de volta da mesma forma.

> **Se a chave se perder.** Outro utilizador do Windows, uma palavra-passe do Windows reposta ou uma pasta de dados copiada não desbloqueiam a cache. O Komorebi oferece então **Começar uma cache nova**: põe de parte os ficheiros bloqueados e transfere o correio de novo. Os rascunhos por enviar e a Caixa de saída que estavam nela perdem-se.

<details>
<summary>Como fica protegida</summary>

- Cada página da cache é selada com AES-256-GCM.
- A chave está em `cache.sqlite3.key`, protegida pelo Windows para que só o seu utilizador a desbloqueie.
- As cópias de anexos em `cache.drafts` e `cache.open` não são cifradas.

</details>
