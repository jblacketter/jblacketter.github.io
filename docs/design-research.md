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

The full audit lives in `docs/contrast-audit.py` and is re-runnable
(`python3 docs/contrast-audit.py`, exit 0 = pass). It computes the ratio for
**every rendered text/background selector pair**, including tint-composited
backgrounds (tags at 6% category tint, badges at 8% amber tint, tier chips at
6% accent tint, CTA pills at 15%/18% accent tint, the translucent topbar), not
just the raw token pairs. Thresholds: 4.5:1 for body/small text and controls,
3:1 for large bold text (card names and category labels, 20.8px at weight 700)
and non-text focus indicators.

Pill-shaped elements (CTAs, topbar CTA, tier chips, badges, tags) use **opaque**
backgrounds (`color-mix(... , var(--bg))` rather than transparent tints), so
their contrast is identical in every context: page background, cards, hovered
cards, the featured band gradient, and the translucent topbar. Hover states are
audited explicitly (CTA hover at 20%, tag hover at 14%).

Result as of this phase: **29 pairs per theme times 5 themes, plus the
theme-invariant placeholder surfaces: all pass.** Worst pair per theme:

| Theme | Worst pair | Ratio | Needs |
|---|---|---|---|
| slate | CTA hover (incl. featured band) | 4.68 | 4.5 |
| charcoal | fun tag hover | 5.56 | 4.5 |
| mist | fun tag hover | 4.50 | 4.5 |
| paper | tools tag hover | 4.68 | 4.5 |
| crt | fun tag hover | 6.82 | 4.5 |

Design rule enforced by the audit: rendered text never uses the raw
`--accent*` / `--cat-*` tokens. Small text and controls use `--link`,
`--link-2`, `--link-3`, or `--cat-*-text-sm`; large bold names use
`--cat-*-text`. Raw accents are decoration only (borders, glows, gradients,
dots, swatches). Category labels were set to weight 700 so their 20.8px size
qualifies as WCAG large text.

Tuning that was required: slate's card darkened `#4a6685` to `#455f7d`, muted
ink raised to `rgba(245, 249, 251, 0.85)`, link tints lifted (`#b8eef0`,
`#f8dfae`, `#e6e0fe`), mist's small teal darkened to `#086568`, paper's amber
deepened to `#8d5309`, and the tag/badge/chip/hover tint percentages reduced
until every composited pair cleared threshold.


## Vertical-space record: aegis-page-refinement

Measured in headless Playwright at 1440x900 after `document.fonts.ready` and all
image decodes settled, same environment for both runs.

| State | scrollHeight |
|---|---|
| Before (main at 7af359a) | 4678px |
| After (tiers moved up, 2-column vignette cards, Surfaces removed, spacing pass) | 4068px |

Reduction: 13.0 percent, while adding six artifact vignettes. The savings came
from removing the Surfaces section, collapsing the stacked hero-bottom plus
section-top padding, and tightening section/heading/diagram spacing on this page
only (page-scoped overrides; the landing page is untouched).
