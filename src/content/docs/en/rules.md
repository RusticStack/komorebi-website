---
title: Set up rules
lede: Mail sorts itself on this PC, so you do not have to.
description: Make Komorebi rules that move, delete or mark new Inbox mail as it arrives, and copy them as a Sieve script for your provider.
---

1. Open **Settings > Rules** and press **New rule**.
2. Name it, press **Add condition** and set the sender, To or Cc, the subject, or **Has attachment**.
3. Under **Do this**, choose what happens, and press **Save**.

Rules run top to bottom on each new message while Komorebi is open, before it reaches the Inbox, so filed mail raises no notification. Mail that came while Komorebi was closed is sorted at the next start.

<details>
<summary>Actions, order and limits</summary>

- Actions: **Move to folder**, **Delete**, **Mark as read**, **Mark as important**, **Stop processing more rules**.
- Several conditions: **All must match** or **Any can match**. Text matches ignore case and accents.
- Order: drag a rule, or use **Move up** and **Move down** in its menu.
- Rules never send mail: no forward, redirect or auto-reply. They stay on this PC.

</details>

<details>
<summary>Copy as Sieve</summary>

**Copy as Sieve** puts your rules on the clipboard as a Sieve script, for your provider's own filters. **Activity** lists what rules did; **Clear activity** empties it.

</details>
