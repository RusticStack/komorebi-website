---
title: Atualizar o Komorebi
lede: Procurada quando pede, verificada antes de instalar.
description: Como o Komorebi procura uma versão nova no GitHub e verifica o SHA-256 e a assinatura Ed25519 antes de a instalar.
---

1. **Procure.** Definições > Acerca de > **Procurar atualizações** pergunta ao GitHub pela versão mais recente. **Procurar atualizações automaticamente** fá-lo no máximo uma vez por dia.
2. **Transfira.** Nada é transferido até premir **Transferir e instalar**.
3. **Verifique.** O instalador só corre se o SHA-256 coincidir com o ficheiro `.sha256` da versão e se a assinatura Ed25519 for válida para a chave incluída no Komorebi.
4. **Instale.** O Komorebi fecha, atualiza-se no mesmo sítio e volta a abrir.

A assinatura abrange a versão e o hash em conjunto, por isso um instalador mais antigo não passa por mais recente. A chave de assinatura fica com o responsável pelo projeto, fora do repositório.

> **Diferente da assinatura de código**
> Esta assinatura protege a atualização na aplicação. O Windows SmartScreen procura a assinatura Authenticode, que as versões ainda não têm. Veja a [política de assinatura de código](/pt/code-signing).
