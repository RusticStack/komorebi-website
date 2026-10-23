---
title: Get notifications
lede: All off until you turn them on, in Settings > General.
description: Turn on Windows notifications for new mail and reminders in Komorebi, keep it in the notification area and start it with Windows.
---

1. **Open Settings > General.**
2. **Turn on Notifications for new mail.** Each account's page can leave that account out.
3. **Choose what shows.** Turn off **Show the sender and subject in notifications** to see only "New mail", for example on the lock screen.
4. **Keep it running.** **Keep running in the notification area when the window closes** keeps mail arriving. Quit from the icon's menu, which also has **Pause notifications**.

Notifications are made on this PC from the connection Komorebi already has. There is no push service. A new account's first download never notifies.

## Start with Windows

**Start with Windows** starts Komorebi in the notification area when you sign in. It writes one value, `Komorebi`, under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`, and removes it when you turn it off.
