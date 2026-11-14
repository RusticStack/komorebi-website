---
title: Add an account
lede: Your mail in Komorebi, in about a minute.
description: Add your email account to Komorebi: type your address, enter the password or app password, and open your inbox. Gmail, iCloud, Yahoo and more are built in.
---

1. Press **Add your email account**. Later: **Settings > Accounts > Add another account**.
2. Type your email address and press **Continue**. Komorebi finds the provider.
3. Type your password and press **Sign in**.

Then **Make it yours** asks for a name and a signature: press **Done**, or **Skip**. When **You're all set** shows, press **Open your inbox**.

> **App passwords.** Many providers need an app password, not your normal one, and the list says which: "App password needed". Make it in your provider's account settings. Komorebi keeps it in Windows Credential Manager, never in its own files.

<details>
<summary>The 26 providers</summary>

- **App password:** AOL Mail, Fastmail, Gmail, Google Workspace, iCloud Mail, Infomaniak, Posteo, Yahoo Mail. Libero Mail and Purelymail only if two-step sign-in is on.
- **Turn on IMAP first:** GMX, GMX.com, WEB.DE, Zoho Mail. Yandex Mail also needs an app password; mail.com needs a paid plan.
- **Account password:** Free, mailbox.org, Orange, Postale.io, Seznam Email.
- **Proton Mail** needs Proton Mail Bridge running on this PC.
- **Outlook.com** and **Microsoft 365** are not supported yet: they need Microsoft sign-in.

A custom domain is recognized by its mail host ("Your mail is hosted by Postale.io"). Only the domain name is looked up.

</details>

<details>
<summary>Any other server</summary>

- Press **Add provider** and fill in the IMAP and SMTP servers. Plaintext connections are refused.
- A relay on your own network can use **This server does not need a sign-in for sending**.
- For a self-signed server, press **Review certificate**: [Trust your own server](/docs/certificates).

</details>

<details>
<summary>If it does not connect</summary>

- A failed check says what went wrong. **Show details** lists every step.
- "That password didn't work": use an app password. **Set username** helps when your login is not your address.

</details>

Removing an account leaves its mail on the server; its drafts and Outbox messages are lost, and Komorebi tells you how many first.
