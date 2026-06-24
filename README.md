# The 8 Love Expressions

A lightweight, single-page self-reflection quiz. A start screen lets you choose
between two versions:

- **Grown-ups:** 40 statements, rated from "Not at all" to "Very true", then a
  read on how you give and receive love across eight expressions.
- **Kids:** 30 simple "would you rather your grown-up..." picks (a hug or a
  chocolate, a movie together or a tidy room), then a friendly bar graph showing
  what they love best. The 30 are drawn fresh from a bank of 100 each time, so
  it rotates and stays fun on replays.

The eight expressions: Nurturing Communication, Time Together, Actions, Thoughtful Gifts,
Physical Affection, Emotional Connection, Intellectual Stimulation and Growth Support.

Everything runs in the browser. Nothing is saved or sent - it all stays on the page.

For reflection, not diagnosis.

## More games for Bella-Paige

`games.html` is a little hub of simple, self-contained games that share one
stylesheet (`style.css`). All client-side, nothing saved:

- **`would-you-rather.html`** - silly rapid-fire choices. Pick a player
  (Bella-Paige or Chris, in their own colours) for solo play, or "Play
  Together" so both pick each card and you see where you matched. 12 drawn
  from a bank each round.
- **`kind-vs-nice.html`** - sort behaviours into Kind / Just nice / In between,
  with a gentle "why" after each. Teaches that kind = nice plus noticing a need.
- **`emotion-detective.html`** - read a face, guess the feeling, see the clues.
  Runs on emoji now; to use your own pictures, drop files in an `images/`
  folder and add `src: "images/happy.png"` to the matching emotion in the
  `EMOTIONS` array at the top of the script.
- **`calm-corner.html`** - a feelings thermometer (1-10) that suggests a
  matching action, plus a dragon-breath animation to follow anywhere.

The love quiz links to the hub, and the hub links back to everything.

## Running it

Open `index.html` (or `games.html`) in any browser, or visit the published
page on GitHub Pages.

## Publishing

`index.html` lives at the repo root. To publish on GitHub Pages:
Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch" ->
Branch: `main` / `/ (root)` -> Save. The site then serves at
https://cayleywright.github.io/Love-quiz/
