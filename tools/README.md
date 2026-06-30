# tools/

## speechify-tts.mjs — render journeys to natural-toned audio

Converts each bracketed script in `../scripts` into Speechify-ready **SSML** and
calls the [Speechify Text-to-Speech API](https://docs.speechify.ai/) to render an
MP3 of the whole journey. Zero dependencies — needs **Node 18+** (uses global
`fetch`).

### How the conversion works

For a guided tapping audio you want the narrator to *speak* the point names and
the breath cues, and to fall *silent* only for the deliberate pauses:

- `[Pause.]` → `<break time="2.5s"/>` (silent)
- `[Long pause.]` → `<break time="8s"/>` (silent)
- **every other bracketed cue is spoken** — point labels (`[Eyebrow]`…), breath
  and grounding cues (`[Take a breath.]`, `[Place a hand on your heart.]`), etc.
- `ROUND n — …` headings and the `⸻` dividers become section breaks (not read).

This means it also handles scripts where spoken lines happen to be bracketed —
they're read aloud, not skipped.

### Use

```bash
export SPEECHIFY_API_KEY=sk_...          # from https://platform.speechify.ai/api-keys

node tools/speechify-tts.mjs                       # render every script -> audio/
node tools/speechify-tts.mjs --only 13-calm-safe-positive
node tools/speechify-tts.mjs --list-voices         # pick a natural voice
node tools/speechify-tts.mjs --dry-run             # write .ssml only, no key, no API call
```

Output lands in `audio/<slug>.mp3` (plus a `<slug>.ssml` for reference). Each
round is sent as its own request and the MP3 parts are concatenated; install
`ffmpeg` if you want sample-accurate gapless joins.

### Useful flags

| Flag | Default | Notes |
|------|---------|-------|
| `--only <slug>` | all | Render one script; repeatable |
| `--voice <id>` | `henry` | Run `--list-voices` to choose a natural one |
| `--model <id>` | `simba-english` | Speechify model |
| `--rate <r>` | `slow` | `x-slow`/`slow`/`medium` or a `%` like `-15%` |
| `--pause <sec>` | `2.5` | Seconds for `[Pause.]` |
| `--long-pause <sec>` | `8` | Seconds for `[Long pause.]` (max 10) |
| `--format <fmt>` | `mp3` | `mp3`/`wav`/`ogg`/`aac` |
| `--out <dir>` | `audio` | Output directory |
| `--dry-run` | off | SSML only, no API key needed |

> The script targets the documented Speechify endpoint
> `https://api.sws.speechify.com/v1/audio/speech` with `Authorization: Bearer`.
> If Speechify changes a field name, adjust `synthChunk()` / `--endpoint`.

## The `/eft-journey` skill

`tools/speechify-tts.mjs` is Phase 3 of the **`/eft-journey`** skill
(`.claude/skills/eft-journey/`), which takes a topic, brainstorms it with you,
writes the script, renders the voiceover with this tool, and publishes it to
`tapping.html` on the site.
