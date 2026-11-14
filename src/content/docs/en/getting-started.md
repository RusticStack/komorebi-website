---
title: Install Komorebi
lede: Komorebi on your PC in about two minutes.
description: Install Komorebi on Windows 10 or 11 (64-bit) in a few clicks, or unzip the portable copy, and get past the SmartScreen warning.
---

1. Press **Download for Windows** on the [download page](/download).
2. Run the installer. It needs no administrator rights.
3. Press **Add your email account**. Then [add your account](/docs/adding-an-account).

> **If Windows protected your PC.** The installer is not code-signed yet, so SmartScreen may warn the first time. Check the file (below), then choose **More info** and **Run anyway**.

<details>
<summary>Check the file first</summary>

- In PowerShell, in the download folder, run `(Get-FileHash .\komorebi-<version>-setup.exe).Hash.ToLower()`.
- The result must match the SHA-256 on the download page and the line for that file in the release's `SHA256SUMS`.

</details>

<details>
<summary>Other ways to install</summary>

- **Portable zip.** `komorebi-<version>-portable-x64.zip` holds `komorebi.exe`. Unzip it anywhere and run it. It keeps its data in `%LOCALAPPDATA%\komorebi`, like the installed app.
- **For all users.** The installer's first page, or `/ALLUSERS`, installs into `Program Files\Komorebi`. That needs administrator rights.
- **Without questions.** `/SILENT` or `/VERYSILENT`. A running Komorebi is closed first and started again afterwards.

</details>

<details>
<summary>Coming from 0.7</summary>

Install over it. Your accounts, mail, rules, contacts and settings carry over.

</details>

## Uninstall

Use Windows Settings > Apps. The uninstaller asks whether to delete `%LOCALAPPDATA%\komorebi` too; No is the default. Saved passwords stay until you [remove your data](/docs/remove-your-data).
