---
title: Update Komorebi
lede: Checked when you ask, verified before it installs.
description: How Komorebi checks GitHub for a new version and verifies its SHA-256 and Ed25519 signature before installing it.
---

1. Open **Settings > About** and press **Check for updates**.
2. Press **Download and install**.

Komorebi verifies the installer, closes, updates in place and starts again. Nothing downloads until you press **Download and install**. **Check for updates automatically** looks at most once a day.

> **Not the same as code signing.** This signature protects the in-app update. Windows SmartScreen looks for Authenticode signing, which releases do not have yet. See the [code signing policy](/code-signing).

<details>
<summary>How it is verified</summary>

- The installer runs only if its SHA-256 matches the release's `.sha256` file and its Ed25519 signature verifies against the key built into Komorebi.
- The signature covers the version and the hash together, so an older installer cannot pass as a newer one.
- The signing key stays with the maintainer, outside the repository.

</details>
