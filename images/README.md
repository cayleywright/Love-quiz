# Emotion Detective images

Drop face images here (e.g. generated with the Higgsfield CLI), one per emotion.

Then open `emotion-detective.html`, find the `EMOTIONS` array near the top of
the `<script>`, and add a `src` to each emotion you have a picture for:

```js
{ label: "Happy", emoji: "😀", src: "images/happy.png", clue: "Big smile, bright eyes, relaxed shoulders." },
```

Any emotion without a `src` simply falls back to its emoji, so the game keeps
working while you add pictures one at a time.

Suggested filenames (matching the built-in emotions):
happy, sad, angry, scared, surprised, excited, shy, worried, proud, bored,
confused, tired, nervous, embarrassed, frustrated, grateful.

Square images work best (they're shown in a square frame, cropped to fill).
