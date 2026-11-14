---
title: Add an account
lede: About a minute. You need your email address and its password.
description: Add a Purelymail, Postale.io or any other IMAP and SMTP account to Komorebi in three short steps.
---

1. **Open the steps.** The first start shows **Add your email account** on the welcome screen. Later, use Settings > Accounts > **Add account**.
2. **Type your email address.** Press **Continue**. Settings for `purelymail.com` and `postale.io` are built in. For other domains Komorebi looks them up, sending only the domain name.
3. **Type your password.** Press **Sign in**. If your provider uses two-step sign-in, use an app password. It is kept in Windows Credential Manager on this PC.
4. **Make it yours.** Add the name people see and a signature, or press **Skip**. **You're all set** shows the first download, newest mail first, until you press **Open your inbox**.

## If it does not connect

- A failed check says what went wrong in one sentence, with the next step to try. **Show details** lists every step and the server names.
- **Change** opens the server settings: host, port, SSL/TLS or STARTTLS, and user names. Plaintext connections are refused. A relay on your own network can be set to **This server does not need a sign-in for sending**; TLS is still required.
- For a self-signed server, **Review certificate** shows its fingerprint. See [Trust your own server](/docs/certificates).
- Accounts that only allow OAuth sign-in, such as Gmail and Microsoft 365, do not work.

## More than one account

Each account has its own folders, and **All inboxes** combines their inboxes. Removing an account leaves its mail on the server; its drafts and Outbox messages are lost, and Komorebi tells you how many first.
