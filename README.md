# Growth

A small set of simple, self-contained games and quizzes for the family,
styled to match the wrightops pocket-money app (soft-pink boutique theme:
white + blush, periwinkle brand, Poppins + Sacramento). Everything runs in the
browser. Nothing is saved or sent - it all stays on the page.

`index.html` is the **Growth** hub and links to everything. The pages share one
stylesheet, `style.css`.

## The pages

- **`index.html`** - the Growth hub (landing page).
- **`would-you-rather.html`** - silly rapid-fire choices from a bank of **1000**
  questions (funny, gross, and some thoughtful), held in `wyr-questions.js`.
  Add **up to 10 players**, each typing their name and picking their own colour.
  Solo (themed in their colour) or play together with a colour pick-dot per
  player and an "everyone agreed" tally. 20 drawn fresh each round.
- **`kind-vs-nice.html`** - sort behaviours into Kind / Just nice / In between,
  with a gentle "why" after each. 60-strong bank, 20 per round.
- **`emotion-detective.html`** - read a face, guess the feeling, see the clues.
  30 emotions, 20 per round. Runs on emoji now; to use your own pictures, drop
  files in an `images/` folder and add `src: "images/happy.png"` to the matching
  emotion in the `EMOTIONS` array.
- **`calm-corner.html`** - a feelings thermometer (1-10) that suggests a matching
  action, plus a dragon-breath animation to follow anywhere.
- **`personality.html`** - "The Five Traits", a personality quiz based on the
  Big Five (Five-Factor Model). 50 statements (10 per trait, reverse-scored,
  shuffled), then your profile across Openness, Conscientiousness, Extraversion,
  Agreeableness and Emotional Stability. For reflection, not diagnosis.
- **`love-quiz.html`** - the 8 Love Expressions quiz (grown-ups + kids versions).

## Theme

`style.css` holds the shared design tokens, matched to pocket-money:
white background with a blush radial gradient, `--ink #2e2533`, periwinkle brand
(`--brand #c1c6fc` fills, `--accent #4347a0` text/buttons), rose and dusty-blue
accents, soft-pink hairlines, rounded cards, Poppins body + Sacramento titles.

## Running it

Open `index.html` in any browser, or visit the published page on GitHub Pages.

## Publishing

Served from the repo root on GitHub Pages: Settings -> Pages -> Source:
"Deploy from a branch" -> Branch: `main` / `/ (root)`.

### Renaming the repo to "growth"

The repo rename happens in GitHub (it can't be done from here):
Settings -> General -> Repository name -> `growth` -> Rename. GitHub redirects
the old URLs, but the live Pages address changes from
`https://cayleywright.github.io/Love-quiz/` to
`https://cayleywright.github.io/growth/`. Pages stays enabled across the rename;
just confirm the Source is still `main` / root afterwards.
