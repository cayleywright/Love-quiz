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

- **`would-you-rather.html`** - silly rapid-fire choices from a bank of **1000**
  questions (funny, gross, and some thoughtful), held in `wyr-questions.js`.
  Add **up to 10 players**, each typing their name and picking their own colour.
  One player = solo (themed in their colour); two or more = play together, where
  everyone picks each card with a colour dot and you see who agreed. 20 drawn
  fresh from the 1000 each round, so it rotates every play.
- **`kind-vs-nice.html`** - sort behaviours into Kind / Just nice / In between,
  with a gentle "why" after each. Teaches that kind = nice plus noticing a need.
  60-strong bank, 20 fresh each round.
- **`emotion-detective.html`** - read a face, guess the feeling, see the clues.
  30 emotions, 20 fresh each round. Runs on emoji now; to use your own pictures,
  drop files in an `images/` folder and add `src: "images/happy.png"` to the
  matching emotion in the `EMOTIONS` array at the top of the script.
- **`calm-corner.html`** - a feelings thermometer (1-10) that suggests a
  matching action, plus a dragon-breath animation to follow anywhere.
- **`personality.html`** - "The Five Traits", a personality quiz based on the
  Big Five (Five-Factor Model). 40 statements (reverse-scored to reduce bias,
  shuffled each load), then your profile across Openness, Conscientiousness,
  Extraversion, Agreeableness and Emotional Stability, with a tuned read on
  where you sit on each. For reflection, not diagnosis.

Every game reshuffles its bank on each play, so the questions rotate. The love
quiz links to the hub, and the hub links back to everything.

## Running it

Open `index.html` (or `games.html`) in any browser, or visit the published
page on GitHub Pages.

## Publishing

`index.html` lives at the repo root. To publish on GitHub Pages:
Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch" ->
Branch: `main` / `/ (root)` -> Save. The site then serves at
https://cayleywright.github.io/Love-quiz/
