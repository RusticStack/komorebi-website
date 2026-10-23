---
title: Confiar no seu servidor
lede: Para um servidor de correio autoassinado ou com AC privada.
description: Fixe no Komorebi o certificado de um servidor de correio autoassinado ou com AC privada, pelo certificado exato, pela chave ou pela AC emissora.
---

O Komorebi verifica todos os certificados de servidor com o Windows, e só envia uma palavra-passe depois de a ligação segura estar estabelecida.

1. **Prima Rever certificado.** Aparece quando uma verificação falha num certificado não fidedigno. O Komorebi lê o certificado sem enviar credenciais.
2. **Compare a impressão digital.** Confirme a impressão digital SHA-256 com a que o seu servidor indica.
3. **Escolha em que confiar:** **Este certificado exato**, **Esta chave do servidor** (resiste a uma renovação que mantém a chave) ou **A AC emissora**.
4. **Confirme.** Nada é guardado antes disto.

Um servidor fixado que apresente outro certificado é recusado antes de qualquer palavra-passe ser enviada, e **Rever certificado** mostra a impressão digital antiga e a nova. **Esquecer certificado**, na página da conta, remove a fixação.
