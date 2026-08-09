#!/usr/bin/env python3
"""WCAG AA contrast audit for the portfolio themes.

Computes the contrast ratio of every rendered text/background selector pair,
including tint-composited backgrounds (color-mix over the theme surface).
Run: python3 docs/contrast-audit.py
Exit code 0 means every pair passes its threshold.

Thresholds: 4.5:1 for body/small text and controls, 3:1 for large text
(>= 18.66px at weight 700) and non-text focus indicators.
"""
import sys


def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(fg_hex, pct, bg):
    fg = hex2rgb(fg_hex)
    return tuple(round(c * pct + bc * (1 - pct)) for c, bc in zip(fg, bg))


def alpha(fg_hex, a, bg):
    return mix(fg_hex, a, bg)


def lum(rgb):
    def f(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


# Token values mirror css/style.css. Update together.
THEMES = {
    'slate': dict(bg='#3e5671', card='#455f7d', ink='#e4ecf0', muted=('#f5f9fb', 0.85),
                  heading='#f5f9fb', link='#b8eef0', link2='#f8dfae', link3='#e6e0fe',
                  accent='#0fbcbf', accent2='#e8a838', on_accent='#0d1a23', on_accent2='#1a1408',
                  topbar=('#1e2c3e', 0.78),
                  cat=dict(dq='#0fbcbf', tl='#e8a838', fn='#a78bfa'),
                  cat_text=dict(dq='#3cd6d9', tl='#efbf63', fn='#c6b5fc'),
                  cat_sm=dict(dq='#b8eef0', tl='#f8dfae', fn='#e6e0fe')),
    'charcoal': dict(bg='#202225', card='#2a2d31', ink='#e6e2d8', muted=('#e6e2d8', 0.72),
                     heading='#f7f4ec', link='#7fdfe1', link2='#e6b45a', link3='#cbbcf8',
                     accent='#4fd8da', accent2='#e6b45a', on_accent='#10282a', on_accent2='#241a08',
                     topbar=('#17191c', 0.82),
                     cat=dict(dq='#4fd8da', tl='#e6b45a', fn='#b7a3f5'),
                     cat_text=dict(dq='#4fd8da', tl='#e6b45a', fn='#b7a3f5'),
                     cat_sm=dict(dq='#4fd8da', tl='#e6b45a', fn='#b7a3f5')),
    'mist': dict(bg='#e9edf2', card='#f7f9fb', ink='#3d4555', muted=('#3d4555', 0.78),
                 heading='#282c38', link='#075559', link2='#6f4a06', link3='#5a41b8',
                 accent='#0a7c7f', accent2='#8a5d08', on_accent='#ffffff', on_accent2='#ffffff',
                 topbar=('#e9edf2', 0.85),
                 cat=dict(dq='#0a7c7f', tl='#8a5d08', fn='#6247c9'),
                 cat_text=dict(dq='#0a7c7f', tl='#8a5d08', fn='#6247c9'),
                 cat_sm=dict(dq='#086568', tl='#6f4a06', fn='#6247c9')),
    'paper': dict(bg='#f6f2e8', card='#fbf8f1', ink='#3a362e', muted=('#3a362e', 0.78),
                  heading='#221f19', link='#095e62', link2='#8d5309', link3='#63449e',
                  accent='#0d7377', accent2='#a2620a', on_accent='#ffffff', on_accent2='#ffffff',
                  topbar=('#f6f2e8', 0.85),
                  cat=dict(dq='#0d7377', tl='#a2620a', fn='#7050c8'),
                  cat_text=dict(dq='#0d7377', tl='#a2620a', fn='#7050c8'),
                  cat_sm=dict(dq='#095356', tl='#8d5309', fn='#63449e')),
    'crt': dict(bg='#0a0e0a', card='#111811', ink='#c9edc9', muted=('#c9edc9', 0.72),
                heading='#eaffea', link='#6dffa0', link2='#ffd23f', link3='#d7b3ff',
                accent='#33ff66', accent2='#ffd23f', on_accent='#06210e', on_accent2='#241d02',
                topbar=('#050805', 0.85),
                cat=dict(dq='#33ff66', tl='#ffd23f', fn='#c792ff'),
                cat_text=dict(dq='#33ff66', tl='#ffd23f', fn='#c792ff'),
                cat_sm=dict(dq='#33ff66', tl='#ffd23f', fn='#c792ff')),
}
DEEP = hex2rgb('#141e2a')  # theme-invariant terminal/diagram surface

# Tint levels mirror css/style.css: tag 8% (hover 14%), badge 8%, tier chip 8%,
# cta 12% (hover 20%), topbar cta 12%; all opaque over var(--bg)
failures = []
for name, t in THEMES.items():
    bg = hex2rgb(t['bg'])
    card = hex2rgb(t['card'])
    topbar = alpha(t['topbar'][0], t['topbar'][1], bg)
    results = []

    def chk(what, fg, over, need):
        r = ratio(fg, over)
        results.append((what, round(r, 2), need))
        if r < need:
            failures.append((name, what, round(r, 2), need))

    chk('body ink / bg', hex2rgb(t['ink']), bg, 4.5)
    chk('body ink / card', hex2rgb(t['ink']), card, 4.5)
    chk('muted / card', alpha(t['muted'][0], t['muted'][1], card), card, 4.5)
    chk('heading / bg', hex2rgb(t['heading']), bg, 4.5)
    chk('a link / card', hex2rgb(t['link']), card, 4.5)
    chk('contact label (link) / card', hex2rgb(t['link']), card, 4.5)
    chk('availability label (link2) / bg', hex2rgb(t['link2']), bg, 4.5)
    chk('card__link (link2) / card', hex2rgb(t['link2']), card, 4.5)
    chk('companion label (link3) / card', hex2rgb(t['link3']), card, 4.5)
    # Pill backgrounds are OPAQUE mixes with the theme bg (color-mix ... , var(--bg)),
    # so these ratios hold in every context: page bg, cards, card hover, the
    # featured band gradient, and the translucent topbar.
    chk('topbar cta (link) / accent 12% opaque', hex2rgb(t['link']), mix(t['accent'], 0.12, bg), 4.5)
    chk('cta normal incl .featured (link) / accent 12% opaque', hex2rgb(t['link']), mix(t['accent'], 0.12, bg), 4.5)
    chk('cta hover incl .featured (link) / accent 20% opaque', hex2rgb(t['link']), mix(t['accent'], 0.20, bg), 4.5)
    chk('tier chip (link) / accent 8% opaque', hex2rgb(t['link']), mix(t['accent'], 0.08, bg), 4.5)
    chk('badge (link2) / accent2 8% opaque', hex2rgb(t['link2']), mix(t['accent2'], 0.08, bg), 4.5)
    chk('primary cta text / accent', hex2rgb(t['on_accent']), hex2rgb(t['accent']), 4.5)
    chk('primary cta hover text / accent2', hex2rgb(t['on_accent2']), hex2rgb(t['accent2']), 4.5)
    for k in ('dq', 'tl', 'fn'):
        chk(f'card name {k} (700 large) / cat 8% over card',
            hex2rgb(t['cat_text'][k]), mix(t['cat'][k], 0.08, card), 3.0)
        chk(f'category label {k} (700 large) / cat 12% over bg',
            hex2rgb(t['cat_text'][k]), mix(t['cat'][k], 0.12, bg), 3.0)
        chk(f'tag {k} (small) / cat 8% opaque',
            hex2rgb(t['cat_sm'][k]), mix(t['cat'][k], 0.08, bg), 4.5)
        chk(f'tag {k} hover (small) / cat 14% opaque',
            hex2rgb(t['cat_sm'][k]), mix(t['cat'][k], 0.14, bg), 4.5)
    chk('focus outline (link) / card (non-text)', hex2rgb(t['link']), card, 3.0)

    worst = min(results, key=lambda r: r[1] / r[2])
    print(f"{name:9s} {len(results)} pairs, worst: {worst[0]} = {worst[1]} (need {worst[2]})")

PANEL = hex2rgb('#1a2332')   # vignette/artwork panel surface
SUBPANEL = hex2rgb('#141e2a')  # inset panes inside vignettes
chk_deep = [
    # vignette text colors vs their fixed panels (theme-invariant artwork)
    ('vignette ink / panel', ratio(hex2rgb('#e4ecf0'), PANEL), 4.5),
    ('vignette muted / panel', ratio(hex2rgb('#8899aa'), PANEL), 4.5),
    ('vignette teal / panel', ratio(hex2rgb('#3cd6d9'), PANEL), 4.5),
    ('vignette teal accent / panel', ratio(hex2rgb('#0fbcbf'), PANEL), 4.5),
    ('vignette amber / panel', ratio(hex2rgb('#efbf63'), PANEL), 4.5),
    ('vignette amber accent / panel', ratio(hex2rgb('#e8a838'), PANEL), 4.5),
    ('vignette green / panel', ratio(hex2rgb('#34d399'), PANEL), 4.5),
    ('vignette red / panel', ratio(hex2rgb('#f97066'), PANEL), 4.5),
    ('vignette purple / panel', ratio(hex2rgb('#c6b5fc'), PANEL), 4.5),
    ('vignette ink / subpanel', ratio(hex2rgb('#e4ecf0'), SUBPANEL), 4.5),
    ('vignette muted / subpanel', ratio(hex2rgb('#8899aa'), SUBPANEL), 4.5),
    ('vignette green / subpanel', ratio(hex2rgb('#34d399'), SUBPANEL), 4.5),
    ('vignette red / subpanel', ratio(hex2rgb('#f97066'), SUBPANEL), 4.5),
]
for what, r, need in chk_deep:
    print(f"invariant  {what} = {round(r, 2)} (need {need})")
    if r < need:
        failures.append(('invariant', what, round(r, 2), need))

if failures:
    print('\nFAILURES:')
    for f in failures:
        print('  ', f)
    sys.exit(1)
print('\nALL PASS')
