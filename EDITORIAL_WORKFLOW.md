# Proposed editorial workflow

This is a future plan, not an implemented pipeline. The current prototype publishes only hand-authored local sample data.

1. **Generate a draft.** A future generator proposes a Cincinnati-flavored premise and writes a draft with headline, deck, body, pull quote, category, and explicit satire framing. It must not publish directly.
2. **Run automated checks.** Validate required fields, unique ID, length, formatting, broken links, duplicate premises, and the presence of satire labeling. Flag real-person names, potentially defamatory assertions, fabricated quotations attributed to real people, and claims that could be mistaken for urgent public-safety information. Checks flag risks; they do not grant approval.
3. **Send to Discord review.** Post the draft and check results to a private editorial review channel, with a link to an internal preview when one exists. Only authorized human editors should make publication decisions. Discord is a review surface, not the canonical content store.
4. **Approve, revise, or reject.** An editor reads the full piece for humor, clarity, originality, factual confusion, and harm. Approval records who approved which exact draft version. Revision returns the draft for another complete check and review; rejection archives the decision without publication.
5. **Publish after approval.** A future publishing step takes only an approved, version-matched draft and adds it to the content source, then verifies the rendered article and archive entry. Changes after approval require a fresh review. Keep a record of decisions and support correction or withdrawal.

No Discord integration, automation, credentials, scheduled jobs, or publishing service is configured in this prototype.
