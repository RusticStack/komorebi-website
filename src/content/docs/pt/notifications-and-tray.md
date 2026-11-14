---
title: Receber notificações
lede: Saiba quando chega correio, sem manter a janela aberta.
description: Ative no Komorebi as notificações do Windows para correio novo, mantenha-o na área de notificação com um ponto de não lidas e inicie-o com o Windows.
---

1. Abra **Definições > Geral**.
2. Ative **Notificações de correio novo**.
3. Ative **Continuar na área de notificação**, para que fechar a janela deixe o correio continuar a chegar.

O ícone na área de notificação mostra um pequeno ponto enquanto tiver correio por ler. Saia pelo menu do ícone, que também tem **Pausar notificações**.

<details>
<summary>Mais opções</summary>

- **Mostrar o remetente e o assunto:** desative para ver só "Novo correio", por exemplo no ecrã de bloqueio.
- **Iniciar com o Windows** abre o Komorebi na área de notificação quando entra no Windows. Escreve um valor, `Komorebi`, em `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`, e remove-o quando o desativa.
- A página de cada conta pode deixar essa conta de fora.

</details>

As notificações são feitas neste PC; não há serviço push. A primeira transferência de uma conta nova nunca notifica.
