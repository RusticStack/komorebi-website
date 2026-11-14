---
title: Receber notificações
lede: Tudo desligado até o ativar, em Definições > Geral.
description: Ative no Komorebi as notificações do Windows para correio novo, mantenha-o na área de notificação e inicie-o com o Windows.
---

1. **Abra Definições > Geral.**
2. **Ative Notificações de correio novo.** A página de cada conta pode deixar essa conta de fora.
3. **Escolha o que aparece.** Desative **Mostrar o remetente e o assunto nas notificações** para ver só "Novo correio", por exemplo no ecrã de bloqueio.
4. **Mantenha-o a correr.** **Continuar na área de notificação quando a janela fecha** deixa o correio continuar a chegar. Saia pelo menu do ícone, que também tem **Pausar notificações**.

As notificações são feitas neste PC a partir da ligação que o Komorebi já tem. Não há serviço push. A primeira transferência de uma conta nova nunca gera notificações.

## Iniciar com o Windows

**Iniciar com o Windows** abre o Komorebi na área de notificação quando entra no Windows. Escreve um valor, `Komorebi`, em `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`, e remove-o quando o desativa.
