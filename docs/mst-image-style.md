# MST Listen-Section Cover Image Style (house style)

The look we standardized on, derived from the **"Brave Moments That Changed the World"**
series covers. Use this for every Listen-section story/episode cover so the library
looks consistent.

## The prompt formula
```
<vivid scene: main subject + setting + a little action/emotion>,
warm golden [+ one accent] tones, [one-line emotional theme],
childrens book illustration, no text
```
Always end with **"childrens book illustration, no text"**. Always include **"warm golden … tones."** Keep it wholesome, calm, no scary/violent elements (kids' bedtime).

## Reference prompts (Brave Moments)
- brave_ep2_mandela: *"Nelson Mandela walking out of prison gates into brilliant golden sunlight, arms raised in triumph, crowds of diverse South African people cheering… rainbow arching over the scene… warm hopeful golden light, freedom and forgiveness, childrens book illustration, no text"*
- brave_ep3_gandhi: *"Mahatma Gandhi… bending down at the edge of the ocean to pick up a handful of salt, thousands of Indian people walking behind him… golden sunset light… peaceful determination… warm amber and ocean blue tones, childrens book illustration, no text"*
- brave_ep7_chipko: *"Village women in colorful saris wrapping their arms around massive ancient Himalayan trees… sunlight filtering through the canopy… warm green and golden tones, Chipko movement, childrens book illustration, no text"*

## Generation (Higgsfield CLI — web account, has credits)
Model **GPT Image 2** (`gpt_image_2`), aspect **2:3** (matches StoryTile cards), quality high, 2K.
Cost ≈ **6.5 credits / image** (starter plan "Private" workspace).
```
higgsfield workspace set 6af49850-0cf2-4ea2-954d-127873504b07   # once
higgsfield generate create gpt_image_2 \
  --prompt "<scene>, warm golden tones, <theme>, childrens book illustration, no text" \
  --aspect_ratio 2:3 --quality high --wait
```
NOTE: this uses the Higgsfield **web account** (CLI OAuth), NOT the platform API key
(`bb848f96…`, 0 credits). The web workspace had 270 credits (Sept 2026).

## Wiring a cover to a story
1. Download the returned PNG.
2. Upload to S3 bucket `mysleepytale-app` at `media/stories/<id>.jpg` → served at
   `https://mysleepytale.com/media/stories/<id>.jpg`.
3. Add `coverImage: 'https://mysleepytale.com/media/stories/<id>.jpg'` to the
   episode/lesson in `client/src/data/series.js` (or register in wisdomImages), deploy.

## Example — black hole (ps_ep9_blackhole)
*"A gentle sleepy giant golden star curling up and hugging itself into a soft glowing
spiral at the heart of a deep starry night sky, ribbons of warm golden light swirling
slowly around it like a cozy whirlpool of stars, a few tiny smiling stars nearby, a
small crescent moon in the corner, soft wisps of cloud along the bottom, wonder and
calm and comfort, warm golden and deep night-blue tones, childrens book illustration,
no text"* — gpt_image_2, 2:3, high.
