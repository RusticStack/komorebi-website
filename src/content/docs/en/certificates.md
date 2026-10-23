---
title: Trust your own server
lede: For a self-signed or private-CA mail server.
description: Pin a self-signed or private-CA mail server's certificate in Komorebi by its exact certificate, its key or its issuing CA.
---

Komorebi checks every server certificate with Windows, and sends a password only after the secure connection is up.

1. **Press Review certificate.** It shows when a check fails on an untrusted certificate. Komorebi reads the certificate without sending any credentials.
2. **Compare the fingerprint.** Check the SHA-256 fingerprint against the one your server reports.
3. **Choose what to trust:** **This exact certificate**, **This server key** (survives a renewal that keeps the key) or **The issuing CA**.
4. **Confirm.** Nothing is saved before this.

A pinned server that shows another certificate is refused before any password is sent, and **Review certificate** shows the old and new fingerprints. **Forget certificate** on the account's page removes the pin.
