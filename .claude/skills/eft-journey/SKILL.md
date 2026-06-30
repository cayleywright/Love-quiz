---
name: eft-journey
description: >-
  Create a new continuous EFT (tapping) journey end to end: take a topic from the
  user, brainstorm the angle and outline together in chat, write the full ~5,000-word
  bracketed script into the scripts/ library, render a natural-toned voiceover with
  Speechify, and publish it on the love-quiz / Growth site. Use when the user wants a
  new tapping script, meditation, or "EFT journey" on a topic (e.g. "make a tapping
  journey for letting go of guilt"), or asks to add/publish one to the site.
---

# EFT journey — end to end

You are producing one new tapping journey for the **Growth / love-quiz** site,
all the way from a topic to a published page with audio. Work through the phases
in order. **Brainstorm and get the user's sign-off before writing the full
script** — do not skip ahead to a finished script on the first message.

Read `reference/eft-style.md` (next to this file) first — it is the canonical
format and is non-negotiable. Skim `scripts/01-being-present.md` for the voice.

## Phase 1 — Topic & brainstorm (in chat)

1. Get the topic. It may be in the skill arguments; if not, ask the user for it.
2. Brainstorm **with the user in chat** before writing anything. Propose, and
   refine together:
   - a working **title** (evocative) and **subtitle** (`A Continuous EFT Journey
     for [Theme] — 20 Rounds`);
   - who it's for and the feeling it meets (one or two lines);
   - the **three-part arc** (acknowledge → soften → reframe) for this topic;
   - a numbered **20-round outline** (round titles only).
3. Keep it conversational and quick. Offer your best proposal first rather than a
   blank slate. Use `AskUserQuestion` only for genuine forks (e.g. two distinct
   angles). **Get explicit approval of the outline before Phase 2.**
4. Make sure the topic is distinct from what's already in `scripts/` (check the
   library index in `scripts/README.md`); if it overlaps, say so and find a fresh
   angle.

## Phase 2 — Write & publish to the library

1. Pick the next number: the highest `NN-…md` in `scripts/` + 1. Choose a short
   hyphenated `slug`. File: `scripts/<NN>-<slug>.md`.
2. Write the **complete ~5,000-word, 20-round** script in the exact bracketed
   format from `reference/eft-style.md`: spoken intro → `[Begin tapping.]` → 20
   rounds (nine points each, `⸻` between them, 3–5 varied bracketed cues after
   each) → closing release/choose sequence → `I am still here.` / `And I am okay.`
   British English; no medical claims; every facet distinct.
3. Add a row to the library table in `scripts/README.md` (number, linked title,
   "for when you feel…").

## Phase 3 — Natural-toned voiceover (Speechify)

The renderer `tools/speechify-tts.mjs` converts the bracketed script to SSML
(`[Pause.]`/`[Long pause.]` → real `<break>`s; point labels and breath cues stay
spoken) and calls the Speechify TTS API.

1. Confirm `SPEECHIFY_API_KEY` is set (`platform.speechify.ai/api-keys`). If it
   isn't, tell the user and either ask them to export it, or run a `--dry-run`
   first so they can preview the SSML, and continue once a key is available.
2. For **natural tones**: use a warm, natural voice and an unhurried pace. Default
   to a calm voice at `--rate slow`. List voices first if unsure:
   `node tools/speechify-tts.mjs --list-voices`
3. Render just this journey:
   `node tools/speechify-tts.mjs --only <NN>-<slug> --rate slow [--voice <id>]`
   This writes `audio/<NN>-<slug>.mp3` (and a `.ssml` alongside for reference).
4. If the API errors on the voice/model, surface the message and adjust (a wrong
   `voice_id` is the usual cause — list voices and pick a valid one).

## Phase 4 — Publish on the site

1. Add an entry to the top of the `TAPPING_JOURNEYS` array in
   `tapping-journeys.js`:
   `{ slug: "<NN>-<slug>", title: "…", subtitle: "…", blurb: "one warm line" }`
   The page (`tapping.html`) auto-loads `scripts/<slug>.md` for the readable text
   and `audio/<slug>.mp3` for the player (the player hides itself if no audio yet).
2. `tapping.html` is already linked from `index.html`; no nav change needed.
3. Commit script + audio + manifest (+ README) and push to the working branch,
   then ensure the PR is up to date. Audio **is** committed here on purpose —
   GitHub Pages serves it for the site player. (Heads-up to the user: meditation
   MP3s are large; if the repo gets heavy, move audio to external hosting and
   point `audio` URLs there instead.)

   ```
   git add scripts/ audio/ tapping-journeys.js tapping.html index.html
   git commit -m "Add <title> tapping journey + audio"
   git push -u origin <branch>
   ```

## Phase 5 — Hand back

Tell the user what was created with links: the script path, the audio file, and
the site page (`tapping.html`). Note anything outstanding (e.g. "set
SPEECHIFY_API_KEY and re-run Phase 3 to add the voiceover").

## Guardrails
- Match the existing library's warm voice and exact format — a listener should
  not be able to tell a new journey from the originals.
- Wellbeing and reflection only; never medical or diagnostic. Keep the gentle,
  non-clinical tone.
- Don't fabricate audio: only claim a voiceover exists once the MP3 is actually
  rendered. If there's no API key, publish the script + page and leave the audio
  step clearly pending.
