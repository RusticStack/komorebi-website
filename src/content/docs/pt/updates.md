---
title: Atualizar o Komorebi
lede: Procurada quando pede, verificada antes de instalar.
description: Como o Komorebi procura uma versão nova no GitHub e verifica o SHA-256 e a assinatura Ed25519 antes de a instalar.
---

1. Abra **Definições > Acerca de** e prima **Procurar atualizações**.
2. Prima **Transferir e instalar**.

O Komorebi verifica o instalador, fecha, atualiza-se no mesmo sítio e volta a abrir. Nada é transferido até premir **Transferir e instalar**. **Procurar atualizações automaticamente** fá-lo no máximo uma vez por dia.

> **Diferente da assinatura de código.** Esta assinatura protege a atualização na aplicação. O Windows SmartScreen procura a assinatura Authenticode, que as versões ainda não têm. Veja a [política de assinatura de código](/pt/code-signing).

<details>
<summary>Como é verificada</summary>

- O instalador só corre se o SHA-256 coincidir com o ficheiro `.sha256` da versão e se a assinatura Ed25519 for válida para a chave incluída no Komorebi.
- A assinatura abrange a versão e o hash em conjunto, por isso um instalador mais antigo não passa por mais recente.
- A chave de assinatura fica com o responsável pelo projeto, fora do repositório.

</details>
