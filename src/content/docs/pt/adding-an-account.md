---
title: Adicionar uma conta
lede: O seu correio no Komorebi, em cerca de um minuto.
description: Adicione a sua conta de correio ao Komorebi: escreva o endereço e a palavra-passe ou palavra-passe de aplicação. Gmail, iCloud e Yahoo já estão incluídos.
---

1. Prima **Adicionar a sua conta de e-mail**. Mais tarde: **Definições > Contas > Adicionar outra conta**.
2. Escreva o seu endereço de e-mail e prima **Continuar**. O Komorebi encontra o fornecedor.
3. Escreva a palavra-passe e prima **Iniciar sessão**.

Depois, **Personalizar** pede um nome e uma assinatura: prima **Concluir**, ou **Ignorar**. Quando aparecer **Está tudo pronto**, prima **Abrir a caixa de entrada**.

> **Palavras-passe de aplicação.** Muitos fornecedores exigem uma palavra-passe de aplicação, não a normal, e a lista diz quais: "Requer palavra-passe de aplicação". Crie-a nas definições da conta do seu fornecedor. O Komorebi guarda-a no Gestor de Credenciais do Windows, nunca nos seus ficheiros.

<details>
<summary>Os 26 fornecedores</summary>

- **Palavra-passe de aplicação:** AOL Mail, Fastmail, Gmail, Google Workspace, iCloud Mail, Infomaniak, Posteo, Yahoo Mail. Libero Mail e Purelymail só se tiver a verificação em dois passos.
- **Ative primeiro o IMAP:** GMX, GMX.com, WEB.DE, Zoho Mail. O Yandex Mail pede também uma palavra-passe de aplicação; o mail.com requer um plano pago.
- **Palavra-passe da conta:** Free, mailbox.org, Orange, Postale.io, Seznam Email.
- **O Proton Mail** requer o Proton Mail Bridge em execução neste PC.
- **Outlook.com** e **Microsoft 365** ainda não são suportados: requerem início de sessão da Microsoft.

Um domínio próprio é reconhecido pelo seu servidor de correio ("O seu correio está alojado em Postale.io"). Só o nome do domínio é consultado.

</details>

<details>
<summary>Qualquer outro servidor</summary>

- Prima **Adicionar fornecedor** e preencha os servidores IMAP e SMTP. As ligações em texto simples são recusadas.
- Um servidor de reencaminhamento na sua própria rede pode usar **Este servidor não precisa de início de sessão para enviar**.
- Num servidor autoassinado, prima **Rever certificado**: [Confiar no seu servidor](/pt/docs/certificates).

</details>

<details>
<summary>Se não ligar</summary>

- Uma verificação falhada diz o que correu mal. **Mostrar detalhes** lista todos os passos.
- "A palavra-passe não funcionou": use uma palavra-passe de aplicação. **Definir nome de utilizador** ajuda quando o seu nome de início de sessão não é o endereço.

</details>

Remover uma conta deixa o correio no servidor; os rascunhos e as mensagens da Caixa de saída dessa conta perdem-se, e o Komorebi diz primeiro quantos são.
