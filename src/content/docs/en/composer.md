---
title: Write and send mail
lede: Write, press send, and have a few seconds to change your mind.
description: Write formatted or plain-text mail in Komorebi, add recipients and attachments, and undo a send within a few seconds.
---

1. Press <kbd>Ctrl+N</kbd> for **New mail**. Reply with <kbd>Ctrl+R</kbd>, reply to all with <kbd>Ctrl+Shift+R</kbd>, forward with <kbd>Ctrl+Shift+F</kbd>.
2. Type the recipient and your message.
3. Press <kbd>Ctrl+Enter</kbd>.

The message waits in the Outbox for 5 seconds. Press **Undo** to take it back.

<details>
<summary>Recipients and writing</summary>

- Addresses become chips after a comma, a semicolon or <kbd>Enter</kbd>. Suggestions come from your contacts. **Cc** and **Bcc** are at the end of the To field.
- A message with no formatting goes out as plain text.
- Attach files with <kbd>Ctrl+Shift+A</kbd>, drop them on the window, or paste files copied in File Explorer. Up to 25 MB in all.

</details>

<details>
<summary>Undo delay and warnings</summary>

- **Settings > General > Undo send** sets the delay, from off to 30 seconds.
- A bar asks once when the subject is empty or your text mentions an attachment that is not there. **Send anyway** sends it as it is.

</details>

<details>
<summary>Drafts and a message that does not go</summary>

- A draft is saved on this PC two seconds after you stop typing, and copied to the server's Drafts folder at most every 30 seconds. <kbd>Esc</kbd> closes the composer and keeps the draft.
- A message that could not reach the server stays in the Outbox and is retried by itself, up to six times. One the server refused is marked failed, with **Retry** and **Edit**.

</details>
