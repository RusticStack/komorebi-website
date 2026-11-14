---
title: Read the FAQ
lede: Short answers to the questions people ask most.
description: Short answers about Komorebi's price, email providers, Gmail, SmartScreen, privacy, languages, the calendar and what it will not do.
---

## Is Komorebi free?

Yes. It is free and open source under GPL-3.0-or-later, with no ads, no paid tier and no account to create.

## Which providers work?

Any provider with IMAP and SMTP and a password or app password. Purelymail and Postale.io settings are built in.

## Does it work with Gmail or Outlook.com?

Not when the account requires OAuth sign-in. OAuth is outside the project's scope.

## Why does SmartScreen warn?

The installer is not Authenticode-signed yet. Check its SHA-256 on the [download page](/download), then choose More info and Run anyway.

## Does it send anything to its developers?

No. There is no telemetry and no Komorebi server. See [what leaves your PC](/docs/privacy-and-network).

## Which languages does it speak?

English and European Portuguese. It follows the Windows display language, and Settings > General > Language can pin one.

## Is there a calendar?

Not in Komorebi 1.0. The calendar is planned to come back in a later version. A meeting invitation still shows on a card above the message, with **Accept**, **Tentative** and **Decline** (the reply goes only to the organizer) and **Save .ics** to take the event to your calendar app.

## Does it run on Arm, macOS or Linux?

No. Releases are for Windows 10 and 11 on x64.

## Can it read S/MIME or PGP mail?

No. Encrypted mail is shown as encrypted, and you can save the encrypted part for a program that has the key.

## Will it get AI features?

No. AI features and telemetry are non-goals of the project.

## Where do I report a problem?

On [GitHub Issues](https://github.com/RusticStack/komorebi/issues).
