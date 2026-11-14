---
title: Encrypt the mail cache
lede: Off by default. Once on, only your Windows user can unlock it.
description: Encrypt Komorebi's local mail cache with AES-256-GCM and a key protected by Windows, and what happens if the key is lost.
---

1. Open **Settings > Privacy**.
2. Turn on **Encrypt the mail cache on this computer** and confirm with **Encrypt at next start**.
3. Press **Restart now**. Turning it off converts the cache back the same way.

> **If the key is lost.** Another Windows user, a reset Windows password or a copied data folder cannot unlock the cache. Komorebi then offers **Start a fresh cache**: it sets the locked files aside and downloads your mail again. Unsent drafts and the Outbox in it are lost.

<details>
<summary>How it is protected</summary>

- Every page of the cache is sealed with AES-256-GCM.
- The key is in `cache.sqlite3.key`, protected by Windows so only your user can unlock it.
- Copies of attachments in `cache.drafts` and `cache.open` are not encrypted.

</details>
