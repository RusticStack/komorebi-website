---
title: Read the FAQ
lede: Short answers, so you can get back to your mail.
description: Short answers about Komorebi's price, email providers, Gmail and Outlook.com, SmartScreen, privacy, languages, the calendar and what it will not do.
---

## Is Komorebi free?

Yes. Free and open source under GPL-3.0-or-later. No ads, no paid tier, no account to create.

## Which providers work?

Any provider with IMAP and SMTP and a password or app password. 26 are built in, such as Gmail, iCloud Mail, Yahoo Mail and Fastmail, and each says whether it needs an app password. Any other server goes in with **Add provider**.

## Does it work with Gmail or Outlook.com?

Gmail does, with an app password. Outlook.com and Microsoft 365 do not yet: they need Microsoft sign-in, which Komorebi does not have, and the list says so.

## Why does SmartScreen warn?

The installer is not Authenticode-signed yet. Check its SHA-256 on the [download page](/download), then choose **More info** and **Run anyway**.

## Does it send anything to its developers?

No. There is no telemetry and no Komorebi server. See [what leaves your PC](/docs/privacy-and-network).

## Which languages does it speak?

English and European Portuguese. It follows the Windows display language; **Settings > General > Language** can pin one.

## What changed in Komorebi 1.0?

A new interface on the same mail engine. Your accounts, mail, rules, contacts and settings carry over. Idle memory and CPU use are higher than in 0.7, and reducing them is planned. High contrast themes are not supported. See the [changelog](/changelog).

## Is there a calendar?

Not in 1.0; it is planned for a later version. A meeting invitation still shows a card with **Accept**, **Tentative**, **Decline** (the reply goes only to the organizer) and **Save .ics**.

## Does it run on Arm, macOS or Linux?

No. Windows 10 and 11 on x64 only.

## Can it read S/MIME or PGP mail?

No. Encrypted mail is shown as encrypted, and you can save it for a program that has the key.

## Will it get AI features?

No. AI features and telemetry are non-goals of the project.

## Where do I report a problem?

On [GitHub Issues](https://github.com/RusticStack/komorebi/issues).
