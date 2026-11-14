---
title: Get notifications
lede: Know when mail arrives, without keeping the window open.
description: Turn on Windows notifications for new mail in Komorebi, keep it in the notification area with an unread dot, and start it with Windows.
---

1. Open **Settings > General**.
2. Turn on **Notifications for new mail**.
3. Turn on **Keep running in the notification area**, so closing the window keeps mail arriving.

The tray icon shows a small dot while you have unread mail. Quit from the icon's menu, which also has **Pause notifications**.

<details>
<summary>More options</summary>

- **Show the sender and subject:** turn it off to see only "New mail", for example on the lock screen.
- **Start with Windows** starts Komorebi in the notification area when you sign in. It writes one value, `Komorebi`, under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`, and removes it when you turn it off.
- Each account's page can leave that account out.

</details>

Notifications are made on this PC; there is no push service. A new account's first download never notifies.
