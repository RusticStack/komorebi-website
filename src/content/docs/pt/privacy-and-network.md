---
title: Ver o que sai do seu PC
lede: Só o que configurar, e só quando pedir.
description: Todas as ligações que o Komorebi faz e quando, como trata imagens remotas e hiperligações, e o que fica no seu PC.
---

O Komorebi não tem telemetria, publicidade nem estatísticas. Não existe nenhum servidor do Komorebi.

| Para | O quê | Quando |
|---|---|---|
| Os seus servidores de correio | Início de sessão, sincronização e o correio que envia | Com o Komorebi aberto, por TLS ou STARTTLS |
| Os seus servidores CardDAV | Contactos | Só onde ativou a sincronização |
| O seu DNS e o servidor web do seu domínio | Só o nome do domínio | Quando adiciona uma conta e o Komorebi procura as definições |
| Os servidores de imagens de uma mensagem | Pedidos das imagens | Só depois de decidir transferi-las |
| GitHub | Uma verificação de atualizações e a atualização que transferir | Quando verifica, ou uma vez por dia se o ativar |

> **Imagens remotas e hiperligações.** As imagens da web ficam bloqueadas até premir **Transferir imagens**. **Transferir sempre deste remetente** guarda o endereço, e **Definições > Privacidade** lista-o. As hiperligações só abrem no browser depois de uma pergunta que mostra o endereço completo.

O correio, os contactos, as regras e as definições ficam em `%LOCALAPPDATA%\komorebi`. As palavras-passe ficam só no Gestor de Credenciais do Windows. A lista completa está na página [Privacidade](/pt/privacy).
