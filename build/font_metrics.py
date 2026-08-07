#!/usr/bin/env python3
"""
Derive the metric-override descriptors for the fallback @font-face rules in
assets/css/tokens.css.

Why this exists: the site self-hosts Inter and Source Serif 4 with
font-display: swap, so text first paints in a local system font and swaps
when the webfont arrives. If the stand-in does not occupy the same space,
every line reflows at the swap and the page shifts — measured at 0.12-0.18
CLS on a throttled mobile load before these overrides were added.

The percentages make a local fallback occupy the same space as the real
font, so the swap costs no layout at all:

    size-adjust      = avg advance width (webfont) / avg advance width (local)
    ascent-override  = typo ascender  / upm / size-adjust
    descent-override = |typo descender| / upm / size-adjust
    line-gap-override= typo line gap  / upm / size-adjust

Averages are taken over a representative Latin sample rather than OS/2's
xAvgCharWidth, which is computed inconsistently between font generations and
gives a ratio that is badly wrong for Inter.

Usage (needs fontTools + brotli, neither of which the site build requires):
    python build/font_metrics.py

Re-run and update tokens.css whenever a font file is replaced.
"""
from __future__ import annotations

from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent

# Mixed case, digits and the punctuation that actually carries text width.
SAMPLE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,:;!?()-"

# webfont subset -> the local fonts named in its fallback @font-face, in the
# same order tokens.css lists them. The first is what the numbers are cut for.
PAIRS = [
    ("Inter Fallback", "assets/fonts/inter-latin.woff2", "C:/Windows/Fonts/arial.ttf"),
    ("Source Serif 4 Fallback", "assets/fonts/source-serif-4-latin.woff2",
     "C:/Windows/Fonts/georgia.ttf"),
]


def measure(path: str | Path) -> dict[str, float]:
    font = TTFont(path, lazy=True)
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    total = count = 0
    for ch in SAMPLE:
        glyph = cmap.get(ord(ch))
        if glyph is None or glyph not in hmtx.metrics:
            continue
        total += hmtx.metrics[glyph][0]
        count += 1
    os2 = font["OS/2"]
    return {
        "avg": total / count / upm,
        "ascent": os2.sTypoAscender / upm,
        "descent": abs(os2.sTypoDescender) / upm,
        "line_gap": os2.sTypoLineGap / upm,
    }


def main() -> None:
    for family, web_rel, local_path in PAIRS:
        web = measure(ROOT / web_rel)
        local = measure(local_path)
        size_adjust = web["avg"] / local["avg"]
        print(f'@font-face {{  /* {family} */')
        print(f'  size-adjust: {size_adjust * 100:.2f}%;')
        print(f'  ascent-override: {web["ascent"] / size_adjust * 100:.2f}%;')
        print(f'  descent-override: {web["descent"] / size_adjust * 100:.2f}%;')
        print(f'  line-gap-override: {web["line_gap"] / size_adjust * 100:.2f}%;')
        print("}")


if __name__ == "__main__":
    main()
