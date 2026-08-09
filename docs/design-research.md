# Design research notes: portfolio-aegis-refresh

Date: 2026-08-09. Sources reviewed before the theme and elevation work, with the
takeaways that were actually applied.

## Sources

1. **Aegis dashboard "Design D" system** (`packages/qaagent/.../index.css` in the aegis repo).
   The SPA's signature tile treatment is a flat offset block shadow
   (`box-shadow: 4px 4px 0 <block color>`) with a per-theme block color
   (mist grey in light themes, deep slate in dark). Its surface ramps
   (`--surface: 246 245 241` slate paper, `246 242 232` warm paper) seeded the
   mist and paper palettes here.
2. **Laws of UX, Aesthetic-Usability effect** (lawsofux.com). Polish earns patience,
   but hierarchy has to survive a squint test in every palette, which is why the
   contrast checks below gate each theme rather than just the default.
3. **Nielsen heuristics: Recognition over Recall + User Control** (nngroup.com).
   Drove the picker design: visible labeled options with swatches instead of a
   cycling icon button, Escape to close, selection reversible and persisted.
4. **Developer portfolio conventions** (survey of well-regarded personal sites and
   the current "neo-brutalist" offset-shadow trend). Takeaways: one flagship
   project above the grid beats a uniform wall of cards; terminal aesthetics read
   as authentic for infrastructure work; theme toggles are expected furniture on
   developer sites (Jakob's Law), so ours sits bottom-right where visitors look
   for them.

## Applied takeaways

- Offset block shadows on cards, the featured band, contact links, and the picker
  itself (`--shadow-block` per theme), with hover moving the card toward the light
  source and growing the offset. One elevation language everywhere.
- Five palettes with stable IDs (`slate`, `charcoal`, `mist`, `paper`, `crt`), all
  driven by the same semantic token set. SVG illustrations stay theme-invariant on
  purpose: they read as screenshots of a dark terminal on any background.
- Text always uses the AA-tuned `--link`, `--link-2`, `--link-3`, and
  `--cat-*-text` tokens; the raw accent tokens are reserved for decor
  (borders, glows, gradients, dots) where contrast rules do not apply.

## WCAG AA contrast record

Computed with the relative-luminance formula (WCAG 2.1), alpha composited where
applicable. Thresholds: body/small text 4.5:1, large bold text (card names,
category labels, 20px+ bold) 3:1, focus indicators 3:1 non-text.

| Pair | slate | charcoal | mist | paper | crt |
|---|---|---|---|---|---|
| ink / bg | 6.33 | 12.33 | 8.19 | 10.75 | 15.22 |
| ink / card | 5.51 | 10.69 | 9.12 | 11.33 | 14.14 |
| muted / card | 5.04 | 6.31 | 4.93 | 5.83 | 7.74 |
| heading / bg | 7.15 | 14.51 | 11.85 | 14.70 | 18.51 |
| link / card | 4.83 | 8.92 | 6.48 | 7.10 | 14.16 |
| link-2 / card | 4.61 | 7.27 | 5.45 | 4.62 | 12.51 |
| link-3 / card | 4.69 | 6.9 | 5.9 | 5.7 | 9.8 |
| on-accent / accent (CTA) | 7.54 | 8.95 | 5.00 | 5.62 | 12.70 |
| on-accent-2 / accent-2 (CTA hover) | 8.79 | 9.00 | 5.75 | 4.90 | 11.62 |
| cat text / card (large bold, 3:1) | 3.58 to 3.86 | 8.0 | 4.7 | 5.3 | 13.4 |
| focus (link) / card (3:1) | 4.83 | 8.92 | 6.48 | 7.10 | 14.16 |

Slate needed tuning to pass: card surface darkened `#4a6685` to `#455f7d`, muted
ink raised to `rgba(245, 249, 251, 0.85)`, and text-lifted variants added for the
teal/amber/purple accents. The four alternate palettes passed as designed.
