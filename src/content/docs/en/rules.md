---
title: Set up rules
lede: Simple rules that sort new Inbox mail on this PC.
description: Make Komorebi rules that move, delete or mark new Inbox mail as it arrives, and copy them as a Sieve script.
---

1. **Open Settings > Rules.** Pick the account.
2. **Add a rule and its conditions:** the sender, To or Cc, the subject, or whether there is an attachment. Text matches ignore case and accents.
3. **Choose what it does:** move to a folder, delete, mark read, mark important, or stop later rules.
4. **Order the rules.** Drag a rule, or use **Move up** and **Move down** in its menu. They run top to bottom on each new message.

Rules run while Komorebi is open, before a message reaches the Inbox, so filed mail raises no notification. Mail that came while Komorebi was closed is sorted at the next start.

## What rules never do

Rules never send mail: no forward, redirect or auto-reply. They stay on this PC.

## Copy as Sieve

**Copy as Sieve** puts your rules on the clipboard as a Sieve script, for your provider's own filters. The activity list shows what rules did; **Clear activity** empties it.
