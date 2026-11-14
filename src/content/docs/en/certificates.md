---
title: Trust your own server
lede: For a self-signed or private-CA mail server, trusted in four clicks.
description: Pin a self-signed or private-CA mail server's certificate in Komorebi by its exact certificate, its key or its issuing CA.
---

1. Press **Review certificate** when a check fails on an untrusted certificate.
2. Compare the SHA-256 fingerprint with the one your server reports.
3. Choose **This exact certificate**, **This server key** or **The issuing CA**, then confirm.

Nothing is saved before you confirm, and no password is sent before the secure connection is up.

> **If the certificate changes.** A pinned server that shows another certificate is refused before any password is sent. **Review certificate** shows the old and new fingerprints.

<details>
<summary>Which one to choose</summary>

- **This exact certificate:** a renewal needs a new review.
- **This server key:** survives a renewal that keeps the key.
- **The issuing CA:** trusts everything that CA signs.
- **Forget certificate**, on the account's page, removes the pin.

</details>
