# Yodel editorial workflow

Yodel uses a human-in-the-loop, multi-stage editorial process. Nothing is published without Gannon's explicit approval of the exact article version.

`VOICE_GUIDE.md` is the editorial standard for premises, drafts, revisions, and final review. When workflow instructions and the voice guide differ, preserve approval and safety requirements while following the voice guide on editorial choices.

## Production assistance

Use GitHub Copilot as Yodel's primary production collaborator for topic exploration, article drafts, revisions, visual prompts, and repository implementation. Invoke Copilot with `--model auto --auto-tier intelligence` and a high reasoning effort so GitHub selects the strongest model available to Gannon's account.

Atlas remains responsible for researching the factual spine, applying the voice guide, independently reviewing Copilot output, tracking exact approval state, and publishing only approved work. Copilot must not commit, push, deploy, or make publication decisions on its own.

1. **Offer a topic slate.** Read `VOICE_GUIDE.md`, research current-event candidates, then use Copilot to explore candidate premises before sending 3–5 possible premises rather than drafts. Each option includes a working headline, category, comic argument, what truth or behavior it exposes, and any material sensitivity. Keep the slate broad; Cincinnati is one possible setting rather than Yodel's identity.
2. **Choose a topic.** Gannon selects one option, requests a variation, or rejects the slate. A rejected topic is not silently recycled in the same run.
3. **Draft the article.** State internally what the premise exposes, then use Copilot to produce the selected premise according to `VOICE_GUIDE.md`. Independently edit and review its work. Use the format and length that best carry the idea rather than forcing every article into the same fake-news template. Include the fields required by the current site without manufacturing a spokesperson, quotation, dateline joke, or fixed ending merely to fill them.
4. **Run editorial checks.** Apply the final editorial test in `VOICE_GUIDE.md`, then validate required fields, formatting, duplicate premises, and satire labeling. Flag real-person names, potentially defamatory assertions, fabricated quotations attributed to real people, sensitive workplace claims, and statements that could be mistaken for urgent public-safety information. Checks flag risks; they do not grant approval.
5. **Review and revise the article.** Send the full draft and check results to Gannon. He may approve, request revisions, or reject it. Every revision creates a new version and reruns the complete checks.
6. **Consider a visual.** After the exact article text is approved, decide whether an editorial illustration adds enough to justify one. Do not generate a decorative image by default. If proposing one, use Copilot to help develop the image prompt, then create a single draft asset consistent with `VOICE_GUIDE.md` and send the exact image with its prompt, alt text, and proposed caption for review. The image is a separate approval gate.
7. **Approve the publication package.** Article approval applies only to the exact displayed text. Image approval applies only to the exact displayed asset. A text-only article may publish after article approval; an article with an image may publish only after both approvals. Any later change requires the relevant approval again.
8. **Publish.** Only an approved, version-matched text package—and, when applicable, image package—may be added to the content source and deployed. Verify the rendered article, archive entry, image, alt text, and caption afterward, then report the URL.

## Review commands

- `CHOOSE <number>` — select a topic from the slate.
- `REVISE: <instructions>` — revise the current draft or topic slate.
- `APPROVE` — approve the exact current article draft.
- `APPROVE IMAGE` — approve the exact image shown for the approved article.
- `REJECT` — discard the current draft without publishing.

The current website is a static prototype. The editorial workflow is being executed through OpenClaw and Discord while publication automation remains approval-gated.
