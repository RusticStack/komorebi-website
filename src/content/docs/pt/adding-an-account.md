---
title: Adicionar uma conta
lede: Cerca de um minuto. Precisa do seu endereço de email e da palavra-passe.
description: Adicione ao Komorebi uma conta Purelymail, Postale.io ou de qualquer outro servidor IMAP e SMTP em três passos curtos.
---

1. **Abra os passos.** O primeiro arranque mostra **Adicionar a sua conta de e-mail** no ecrã de boas-vindas. Mais tarde, use Definições > Contas > **Adicionar conta**.
2. **Escreva o seu endereço de email.** Prima **Continuar**. As definições de `purelymail.com` e `postale.io` já estão incluídas. Para outros domínios, o Komorebi procura-as e envia só o nome do domínio.
3. **Escreva a palavra-passe.** Prima **Iniciar sessão**. Se o seu fornecedor usa verificação em dois passos, use uma palavra-passe de aplicação. Fica guardada no Gestor de Credenciais do Windows, neste PC.
4. **Personalize.** Junte o nome que as pessoas veem e uma assinatura, ou prima **Ignorar**. **Está tudo pronto** mostra a primeira transferência, do correio mais recente para o mais antigo, até premir **Abrir a caixa de entrada**.

## Se não ligar

- Uma verificação falhada diz numa frase o que correu mal e o que tentar a seguir. **Mostrar detalhes** lista todos os passos e os nomes dos servidores.
- **Alterar** abre as definições do servidor: anfitrião, porta, SSL/TLS ou STARTTLS e nomes de utilizador. As ligações em texto simples são recusadas. Um servidor de reencaminhamento na sua própria rede pode usar **Este servidor não precisa de início de sessão para enviar**; o TLS continua a ser obrigatório.
- Num servidor autoassinado, **Rever certificado** mostra a impressão digital. Veja [Confiar no seu servidor](/pt/docs/certificates).
- As contas que só aceitam início de sessão OAuth, como Gmail e Microsoft 365, não funcionam.

## Mais de uma conta

Cada conta tem as suas pastas, e **Todas as caixas de entrada** junta as caixas de entrada de todas. Remover uma conta deixa o correio no servidor; os rascunhos e as mensagens da Caixa de saída dessa conta perdem-se, e o Komorebi diz primeiro quantos são.
