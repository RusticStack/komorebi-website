---
title: Install Komorebi
lede: A few minutes. You need Windows 10 or 11, 64-bit.
description: Download Komorebi 1.0, check its SHA-256, install it for your Windows user or unzip the portable copy, and get past the SmartScreen warning.
---

1. **Download the installer.** Use the button on the [download page](/download), which also shows the installer's SHA-256.
2. **Check the file.** In PowerShell, in the download folder, run `(Get-FileHash .\komorebi-<version>-setup.exe).Hash.ToLower()`. The result must match the SHA-256 on the download page, and the line for that file in the release's `SHA256SUMS`.
3. **Run it.** It installs `komorebi.exe` for your Windows user only, into `%LOCALAPPDATA%\Programs\Komorebi`, with no administrator rights, and adds a Start menu shortcut.
4. **Start Komorebi.** The welcome screen offers to [add your first account](/docs/adding-an-account).

> **If Windows protected your PC**
> The installer is not code-signed yet, so SmartScreen may warn the first time. After you have checked the hash, choose **More info**, then **Run anyway**.

## Other ways to install

- **The portable zip.** `komorebi-<version>-portable-x64.zip` holds `komorebi.exe` with the licence, the privacy statement and the changelog. Unzip it anywhere and run it; it keeps its data in `%LOCALAPPDATA%\komorebi`, as the installed app does.
- **For all users.** The installer's first page, or `/ALLUSERS`, installs into `Program Files\Komorebi`. That asks for administrator rights.
- **Without questions.** `/SILENT` or `/VERYSILENT` install without asking; a running Komorebi is closed first and started again afterwards.

## Coming from 0.7

Install 1.0 over 0.7, or let Settings > About update it. Your accounts, mail cache, rules, contacts and settings carry over and nothing is downloaded again. The window opens at its default place the first time.

## Uninstall

Use Windows Settings > Apps. The uninstaller asks whether to delete `%LOCALAPPDATA%\komorebi` too; No is the default. Saved passwords stay in Credential Manager until you [remove your data](/docs/remove-your-data) from inside Komorebi.
