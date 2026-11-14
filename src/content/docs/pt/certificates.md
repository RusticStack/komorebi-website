---
title: Confiar no seu servidor
lede: Para um servidor de correio autoassinado ou com AC privada, em quatro cliques.
description: Fixe no Komorebi o certificado de um servidor de correio autoassinado ou com AC privada, pelo certificado exato, pela chave ou pela AC emissora.
---

1. Prima **Rever certificado** quando uma verificação falha num certificado não fidedigno.
2. Compare a impressão digital SHA-256 com a que o seu servidor indica.
3. Escolha **Este certificado exato**, **Esta chave do servidor** ou **A AC emissora** e confirme.

Nada é guardado antes de confirmar, e nenhuma palavra-passe é enviada antes de a ligação segura estar estabelecida.

> **Se o certificado mudar.** Um servidor fixado que apresente outro certificado é recusado antes de qualquer palavra-passe ser enviada. **Rever certificado** mostra a impressão digital antiga e a nova.

<details>
<summary>Qual escolher</summary>

- **Este certificado exato:** uma renovação exige nova revisão.
- **Esta chave do servidor:** resiste a uma renovação que mantém a chave.
- **A AC emissora:** confia em tudo o que essa AC assina.
- **Esquecer certificado**, na página da conta, remove a fixação.

</details>
