# Lesson illustrations

The lesson player can render optional illustrations for each scenario, choice, and consequence. The UI gracefully falls back to text-only rendering when an image is missing or 404s.

## Asset layout

Images live at `public/images/exercises/<id>.png` and are served at `/images/exercises/<id>.png` by Vite. Naming convention comes from `scripts/generate-images.mjs`:

| File | Aspect | Used by |
| --- | --- | --- |
| `<exercise>-scenario.png` | 16:9 | Above the scenario text |
| `<exercise>-choice-<choiceId>.png` | 1:1 | Replaces the A/B/C letter avatar in the choice button |
| `<exercise>-consequence-<choiceId>.png` | 1:1 | Inside the feedback panel, after the consequence text |

## Style guide

`image-prompts.json` carries a `meta.styleGuide` field that every prompt in the file uses as a prefix. Keep it in sync with whatever model/provider you use.

## Generating the assets

1. **Set the API token** in `.env` (gitignored) — never paste it into chat:
   ```
   AVIBI_IMAGE_API_TOKEN=sk-...
   ```
   Also add the variable name to `.env.example` so the team knows it exists.

2. **Run the generator:**
   ```bash
   node scripts/generate-images.mjs                       # all prompts
   node scripts/generate-images.mjs --only ex-coz-1       # one exercise
   node scripts/generate-images.mjs --skip-existing       # resume
   ```

3. **Restart the dev server** if it's already running (Vite serves `/public` but may cache).

The script reads prompts from `image-prompts.json`, hits the provider API in batches of 4, downloads the response (URL form), and saves to `public/images/exercises/`.

## Iterating on style

The first batch is the style proof. If colors / shapes / character style aren't right:
1. Edit `meta.styleGuide` in `image-prompts.json`.
2. Re-run with `--only ex-coz-1` (or any one exercise) for a quick test.
3. Once happy, drop `--only` to regenerate everything.

## Adding new exercises

1. Write the exercise in `src/mocks/index.ts` with stable `id`, choice `id`s, scenario text, etc.
2. Add corresponding entries to `image-prompts.json` (the naming convention mirrors `exercise.id` and `choice.id`).
3. Run the generator.
4. The player picks up the new assets automatically — no code changes needed.
