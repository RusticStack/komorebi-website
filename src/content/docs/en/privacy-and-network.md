---
title: See what leaves your PC
lede: Only what you set up, and only when you ask.
description: Every connection Komorebi makes and when, how remote images and links are handled, and what stays on your PC.
---

Komorebi has no telemetry, no ads and no analytics. There is no Komorebi server.

| To | What | When |
|---|---|---|
| Your mail servers | Sign-in, sync and the mail you send | While Komorebi runs, over TLS or STARTTLS |
| Your CardDAV and CalDAV servers | Contacts and events | Only where you turned sync on |
| Your DNS and your domain's web server | The domain name only | When you ask Komorebi to find settings |
| A message's image hosts | Requests for its images | Only after you choose to load them |
| GitHub | An update check, and the update you download | When you check, or once a day if you turn that on |

## Remote images and links

Images from the web are blocked until you choose. **Load images** loads them for one message; **Always load from this sender** remembers the address, and Settings > Privacy lists it. Links open in your browser only after a prompt that shows the full address.

## What stays here

Mail, contacts, the calendar, rules and settings live in `%LOCALAPPDATA%\komorebi`. Passwords live only in Windows Credential Manager. The full list is on the [Privacy](/privacy) page.
