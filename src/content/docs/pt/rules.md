---
title: Criar regras
lede: O correio arruma-se sozinho neste PC, sem trabalho seu.
description: Crie regras no Komorebi que movem, eliminam ou marcam o correio novo da Caixa de entrada quando chega, e copie-as como script Sieve.
---

1. Abra **Definições > Regras** e prima **Nova regra**.
2. Dê-lhe um nome, prima **Adicionar condição** e defina o remetente, Para ou Cc, o assunto, ou **Tem anexo**.
3. Em **Fazer o seguinte**, escolha o que acontece e prima **Guardar**.

As regras atuam de cima para baixo em cada mensagem nova, com o Komorebi aberto e antes de chegar à Caixa de entrada, por isso o correio arrumado não gera notificação. O correio que chegou com o Komorebi fechado é arrumado no arranque seguinte.

<details>
<summary>Ações, ordem e limites</summary>

- Ações: **Mover para a pasta**, **Eliminar**, **Marcar como lida**, **Marcar como importante**, **Não aplicar mais regras**.
- Várias condições: **Todas têm de corresponder** ou **Basta uma corresponder**. O texto ignora maiúsculas e acentos.
- Ordem: arraste uma regra, ou use **Mover para cima** e **Mover para baixo** no seu menu.
- As regras nunca enviam correio: não há reencaminhamento, redirecionamento nem resposta automática. Ficam neste PC.

</details>

<details>
<summary>Copiar como Sieve</summary>

**Copiar como Sieve** põe as suas regras na área de transferência como script Sieve, para os filtros do seu fornecedor. **Atividade** mostra o que as regras fizeram; **Limpar atividade** esvazia-a.

</details>
