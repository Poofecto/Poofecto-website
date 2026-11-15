# PooFecto! website

Static site for GitHub Pages. No build step and no dependencies, except Google Fonts (Outfit and DM Sans) loaded from fonts.googleapis.com.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The full one-page site: hero, how it works, pricing calculator, why PooFecto!, Behind the Scoop, community, FAQ, quote form |
| `privacy.html` | Plain-language privacy page, including how FormSubmit handles the form |
| `styles.css` | All styles. Brand colors are at the top (`--lime`, `--bg`) |
| `script.js` | Pricing calculator, mobile menu, footer year. Rates live in `RATES` at the top |
| `assets/poofecto-logo.png` | Official logo (transparent background), from the supplied file |
| `assets/dog-mascot.png` | Dog + swoosh, cropped from the official logo |
| `assets/dog-small.png` | Favicon |
| `assets/landmine-sticker.png` | Approved landmine sticker, background removed (not currently used on the page, kept for social) |
| `assets/hero-golden.jpg` | Hero photo |
| `assets/scooping.jpg` | How it works photo |
| `assets/gate-photo-text.jpg`, `treat-bags.jpg`, `birthday-pupcake.jpg` | Why PooFecto! card photos |
| `assets/yard-minefield.jpg` | Behind the Scoop example, captioned as an example |
| `assets/owner-truck.jpg` | Meet your scooper photo |

**Photo honesty:** if any photo is AI-generated or stock, don't present it as a real customer, yard or job. Swap in real photos as you get them by replacing the file with the same name, and nothing else needs to change. The owner photo should be the real owner.

All paths are relative, so the site works on both the GitHub Pages project URL and poofecto.com.

## How to upload (GitHub web)

1. Open the `Poofecto/Poofecto-website` repository.
2. Delete the old `index.html`, `styles.css`, `script.js`, `privacy.html` and the old `assets/` files you're replacing. Keep `CNAME` if you have one.
3. **Add file → Upload files**, then drag in everything from this folder, keeping the `assets` folder.
4. Commit to `main`. Pages redeploys in about a minute.

## Owner actions before promoting the site

- [ ] **Activate FormSubmit:** submit a test quote, click the activation link FormSubmit emails to poofecto@gmail.com, then submit a second test and confirm it arrives.
- [ ] **Lime color:** the site uses `#BAF820`. Sampling the logo file reads closer to `#BEFA0A`. Pick one and update `--lime` in `styles.css`.
- [ ] **Custom domain:** in GoDaddy DNS, add the GitHub Pages A records and a `www` CNAME. Then set the custom domain in repo **Settings → Pages** and turn on **Enforce HTTPS**.
- [ ] **Vector logo:** the logo PNG has a soft glow baked in. Get a clean SVG for print, vehicle wraps and shirts.
- [ ] Confirm the text-update promises (day-before reminder, on-the-way text, gate photo) once your scheduling tool is set up.
- [ ] Add real before/after photos and testimonials only when you have them, with permission.

## What the site does not claim

The site never says licensed, insured, eco-friendly, "no contracts", a response time, a service radius, or reviews. Add those only once they're true and approved.

## Tested

- Widths 1440, 390 and 320 px, with no horizontal scroll.
- Calculator: 1 to 4 dogs × 4 or 5 visits, matching the Bible's table (for example, 3 dogs × 5 visits = $140).
- Mobile menu: opens and closes, and closes with Escape and on link tap.
- Keyboard focus is visible, all form fields are labeled, and reduced motion is respected.
