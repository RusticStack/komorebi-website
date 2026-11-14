---
title: Ler as perguntas frequentes
lede: Respostas curtas às perguntas mais comuns.
description: Respostas curtas sobre o preço do Komorebi, fornecedores de email, Gmail, SmartScreen, privacidade, idiomas, o calendário e o que não vai fazer.
---

## O Komorebi é gratuito?

Sim. É gratuito e de código aberto, com a licença GPL-3.0-or-later, sem anúncios, sem versão paga e sem conta para criar.

## Que fornecedores funcionam?

Qualquer fornecedor com IMAP e SMTP e uma palavra-passe ou palavra-passe de aplicação. As definições da Purelymail e da Postale.io estão incluídas.

## Funciona com Gmail ou Outlook.com?

Não quando a conta exige início de sessão OAuth. O OAuth está fora do âmbito do projeto.

## Porque é que o SmartScreen avisa?

O instalador ainda não tem assinatura Authenticode. Confirme o SHA-256 na [página de transferência](/pt/download) e escolha Mais informações e Executar mesmo assim.

## Envia alguma coisa a quem o faz?

Não. Não há telemetria nem servidor do Komorebi. Veja [o que sai do seu PC](/pt/docs/privacy-and-network).

## Que idiomas fala?

Inglês e português europeu. Segue o idioma de apresentação do Windows, e Definições > Geral > Idioma pode fixar um.

## O que mudou no Komorebi 1.0?

Uma interface nova sobre o mesmo motor de correio: o Komorebi passa a desenhar com GPUI e DirectX 11, segue o Fluent 2 e tem um aspeto novo. As contas, o correio, as regras, os contactos e as definições passam para a nova versão. A memória e o processador usados em repouso são mais altos do que na 0.7, e está prevista a sua redução. Os temas de alto contraste não são suportados na 1.0. A lista completa está nas [alterações](/pt/changelog).

## Tem calendário?

Não no Komorebi 1.0. O calendário deverá voltar numa versão posterior. Um convite para uma reunião continua a aparecer num cartão por cima da mensagem, com **Aceitar**, **Provisório** e **Recusar** (a resposta vai só para o organizador) e **Guardar .ics** para levar o evento para a sua aplicação de calendário.

## Funciona em Arm, macOS ou Linux?

Não. As versões são para Windows 10 e 11 em x64.

## Consegue ler correio S/MIME ou PGP?

Não. O correio cifrado aparece como cifrado, e pode guardar a parte cifrada para um programa que tenha a chave.

## Vai ter funcionalidades de IA?

Não. Funcionalidades de IA e telemetria estão fora dos objetivos do projeto.

## Onde comunico um problema?

Nos [pedidos do GitHub](https://github.com/RusticStack/komorebi/issues).
