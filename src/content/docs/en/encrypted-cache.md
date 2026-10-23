---
title: Encrypt the mail cache
lede: Off by default. Only your Windows user can unlock it.
description: Encrypt Komorebi's local mail cache with AES-256-GCM and a key protected by Windows, and what happens if the key is lost.
---

1. **Open Settings > Privacy.**
2. **Turn on encryption.** Choose **Encrypt the mail cache on this computer** and read the question that explains the risk.
3. **Restart.** The next start, or **Restart now**, converts the cache. Turning it off converts it back the same way.

Every page of the cache is sealed with AES-256-GCM. The key is in `cache.sqlite3.key`, protected by Windows so only your user can unlock it. Copies of attachments in `cache.drafts` and `cache.open` are not encrypted.

> **If the key is lost**
> Another Windows user, a reset Windows password or a copied data folder cannot unlock the cache. Komorebi then offers **Start a fresh cache**, which sets the locked files aside and downloads your mail again; unsent drafts in it are lost.
