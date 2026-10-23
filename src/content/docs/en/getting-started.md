---
title: Install Komorebi
lede: A few minutes. You need Windows 10 or 11, 64-bit.
description: Download Komorebi, check the installer's SHA-256, install it for your Windows user and get past the SmartScreen warning.
---

1. **Download the installer.** Use the button on the [download page](/download), which also shows the installer's SHA-256.
2. **Check the file.** In PowerShell, in the download folder, run `(Get-FileHash .\komorebi-<version>-setup.exe).Hash.ToLower()`. The result must match the SHA-256 on the download page.
3. **Run it.** It installs for your Windows user only, into `%LOCALAPPDATA%\Programs\Komorebi`, with no administrator rights.
4. **Start Komorebi.** The welcome screen offers to [add your first account](/docs/adding-an-account).

> **If Windows protected your PC**
> The installer is not code-signed yet, so SmartScreen may warn the first time. After you have checked the hash, choose **More info**, then **Run anyway**.

## Other ways to install

- The installer's first page can install for all users. That asks for administrator rights and uses `Program Files\Komorebi`.
- `/SILENT` or `/VERYSILENT` install without questions.

## Uninstall

Use Windows Settings > Apps. The uninstaller asks whether to delete `%LOCALAPPDATA%\komorebi` too; No is the default. Saved passwords stay in Credential Manager until you [remove your data](/docs/remove-your-data) from inside Komorebi.
