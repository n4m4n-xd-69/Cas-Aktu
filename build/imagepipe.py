"""
Build-time responsive image pipeline.

Takes the curated records in data/images.py and emits, for each one, a set of
width-limited derivatives in AVIF, WebP and JPEG, plus a tiny blurred
placeholder inlined as a data URI. The generated markup always carries
explicit width/height so nothing reflows while images load (CLS).

Encoding is the slowest part of the build, so results are cached: a derivative
is only re-encoded when the source file's size or mtime changes. Delete
site/assets/img/ (or the manifest cache) to force a full rebuild.

Requires Pillow. If Pillow is missing the build still succeeds — it falls back
to copying the original file and emits a plain <img>, so the site is never
blocked on an optional dependency.
"""
from __future__ import annotations

import base64
import hashlib
import html
import io
import json
import shutil
from pathlib import Path

try:
    from PIL import Image
    HAVE_PIL = True
except ImportError:  # pragma: no cover - optional dependency
    HAVE_PIL = False

# Width ladder. Wide hero art needs the top rungs; cards never do, so each
# call passes the largest width it can actually occupy and we skip the rest.
WIDTHS = [320, 480, 640, 960, 1280, 1600, 1920, 2560]

QUALITY = {"avif": 48, "webp": 74, "jpeg": 80}

# Encoder tuning, measured on this machine at 1280px:
#   avif default (speed 0-6) 1.90s / 49 KB
#   avif speed=8             0.65s / 47 KB   <- 3x faster AND smaller
#   avif speed=10            0.41s / 59 KB   <- too lossy for the saving
ENCODER_ARGS = {
    "avif": {"speed": 8},
    "webp": {"method": 5},
    "jpeg": {"progressive": True, "optimize": True},
}

LQIP_W = 20

# Standard size tiers. Call sites must use these constants rather than ad-hoc
# numbers — max_width is part of the cache key, so a one-off value silently
# forces a full re-encode of that image on every build.
HERO_W = 2560   # full-bleed cinematic hero
BAND_W = 1920   # full-width section band
HALF_W = 1280   # half-width split layout
CARD_W = 960    # card / mosaic tile
THUMB_W = 640   # rail item, list thumbnail


class ImagePipeline:
    def __init__(self, root: Path):
        self.root = root
        self.src_dir = root / "source-assets" / "images"
        # Derivatives are encoded into a persistent cache OUTSIDE site/, then
        # copied in. generate.py's clean_site() deletes site/ on every build,
        # so encoding straight into it meant the cache (keyed only on the
        # source fingerprint) reported a hit while the output files had just
        # been deleted — every image 404'd on the second build onwards.
        self.store = root / "build" / ".imgcache"
        self.out_dir = root / "site" / "assets" / "img"
        self.store.mkdir(parents=True, exist_ok=True)
        self.out_dir.mkdir(parents=True, exist_ok=True)
        self.cache_path = root / "build" / ".imagecache.json"
        try:
            self.cache = json.loads(self.cache_path.read_text(encoding="utf-8"))
        except Exception:
            self.cache = {}
        self.stats = {"encoded": 0, "cached": 0, "copied": 0}
        self._lqip: dict[str, str] = {}
        self._meta: dict[str, tuple[int, int]] = {}

    # -- helpers ---------------------------------------------------------
    def _slug(self, src: str) -> str:
        """Stable, readable output name. The legacy hash suffix is dropped and
        replaced with a short digest so two sources that shorten to the same
        stem can never collide."""
        stem = Path(src).stem
        base = stem.rsplit("-", 1)[0] if "-" in stem else stem
        base = "".join(c if c.isalnum() or c == "-" else "-" for c in base).strip("-").lower()
        base = base or "img"
        digest = hashlib.sha1(src.encode()).hexdigest()[:6]
        return f"{base}-{digest}"

    def _fingerprint(self, path: Path) -> str:
        st = path.stat()
        return f"{st.st_size}:{int(st.st_mtime)}"

    def source_path(self, src: str) -> Path:
        return self.src_dir / src

    # -- main ------------------------------------------------------------
    def process(self, src: str, max_width: int = 1920) -> dict | None:
        """Encode derivatives for one source image. Returns render metadata."""
        sp = self.source_path(src)
        if not sp.exists():
            raise FileNotFoundError(
                f"data/images.py references {src!r}, which is not in "
                f"source-assets/images/. Fix the manifest entry."
            )
        slug = self._slug(src)

        if not HAVE_PIL:
            dest = self.out_dir / sp.name
            if not dest.exists():
                shutil.copyfile(sp, dest)
                self.stats["copied"] += 1
            return {"slug": slug, "fallback": f"assets/img/{sp.name}",
                    "sources": {}, "w": None, "h": None, "lqip": None}

        with Image.open(sp) as im:
            ow, oh = im.size
        ratio = oh / ow
        widths = [w for w in WIDTHS if w <= min(max_width, ow)]
        if not widths:
            widths = [min(max_width, ow)]
        if max(widths) < min(max_width, ow):
            widths.append(min(max_width, ow))

        fp = self._fingerprint(sp)
        key = f"{slug}@{max_width}"
        cached = self.cache.get(key)
        # A cache hit must also mean the encoded files are still on disk.
        # Trusting the fingerprint alone is what produced the 404s above.
        need = (
            cached is None
            or cached.get("fp") != fp
            or not all((self.store / f"{slug}-{w}.jpg").exists() for w in cached.get("widths", []))
        )

        if need:
            with Image.open(sp) as im:
                im = im.convert("RGB")
                for w in widths:
                    h = max(1, round(w * ratio))
                    rs = im.resize((w, h), Image.LANCZOS)
                    for fmt, ext in (("avif", "avif"), ("webp", "webp"), ("jpeg", "jpg")):
                        out = self.store / f"{slug}-{w}.{ext}"
                        try:
                            rs.save(out, format=fmt.upper(), quality=QUALITY[fmt],
                                    **ENCODER_ARGS[fmt])
                        except Exception:
                            # AVIF encoder unavailable in this Pillow build —
                            # WebP/JPEG still cover every supported browser.
                            if fmt == "avif":
                                continue
                            raise
                # blurred placeholder, inlined so it costs no request
                lq = im.resize((LQIP_W, max(1, round(LQIP_W * ratio))), Image.LANCZOS)
                buf = io.BytesIO()
                lq.save(buf, format="JPEG", quality=35)
                lqip = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

            self.cache[key] = {"fp": fp, "widths": widths, "w": ow, "h": oh, "lqip": lqip}
            self.stats["encoded"] += 1
        else:
            self.stats["cached"] += 1
            widths = cached["widths"]
            ow, oh = cached["w"], cached["h"]
            lqip = cached["lqip"]

        self._lqip[slug] = lqip
        self._meta[slug] = (ow, oh)

        # Publish this image's derivatives into the generated site. Copying
        # is cheap next to encoding, and it means a wiped site/ costs a file
        # copy rather than a 17-minute re-encode.
        for w in widths:
            for ext in ("avif", "webp", "jpg"):
                srcf = self.store / f"{slug}-{w}.{ext}"
                if not srcf.exists():
                    continue
                dstf = self.out_dir / srcf.name
                if not dstf.exists() or dstf.stat().st_size != srcf.stat().st_size:
                    shutil.copyfile(srcf, dstf)

        def srcset(ext: str) -> str:
            return ", ".join(f"assets/img/{slug}-{w}.{ext} {w}w" for w in widths)

        have_avif = (self.store / f"{slug}-{widths[0]}.avif").exists()
        sources = {"webp": srcset("webp")}
        if have_avif:
            sources = {"avif": srcset("avif"), **sources}

        biggest = max(widths)
        return {
            "slug": slug,
            "sources": sources,
            "jpeg": srcset("jpg"),
            "fallback": f"assets/img/{slug}-{biggest}.jpg",
            "w": biggest,
            "h": round(biggest * ratio),
            "lqip": lqip,
        }

    def save(self) -> None:
        self.cache_path.write_text(json.dumps(self.cache), encoding="utf-8")


# One pipeline per build. Page modules reach for it through get_pipeline()
# rather than receiving it as an argument, so the twenty existing
# module.build(render_page, load_content, root) signatures stay untouched.
_PIPELINE: ImagePipeline | None = None


def get_pipeline(root: Path) -> ImagePipeline:
    global _PIPELINE
    if _PIPELINE is None:
        _PIPELINE = ImagePipeline(root)
    return _PIPELINE


# ---------------------------------------------------------------------------
# Markup
# ---------------------------------------------------------------------------

def _prefixed(srcset: str, prefix: str) -> str:
    """Prepend `prefix` to every URL in a srcset (or to a bare src)."""
    if not prefix:
        return srcset
    out = []
    for candidate in srcset.split(","):
        candidate = candidate.strip()
        if not candidate:
            continue
        url, _, descriptor = candidate.partition(" ")
        out.append(f"{prefix}{url}{' ' + descriptor if descriptor else ''}")
    return ", ".join(out)


def picture(meta: dict, rec: dict, *, sizes: str, cls: str = "",
            priority: bool = False, ratio: str | None = None,
            defer: bool = False, prefix: str = "") -> str:
    """`defer=True` emits the URLs in data- attributes instead of srcset/src,
    so the browser does not fetch the image until app.js hydrates it.

    This exists for the hero deck. Its slides are absolutely positioned over
    each other inside the viewport, so they are all technically *visible* and
    loading="lazy" does not defer them — the browser fetched and decoded six
    full-width AVIFs before first paint, which cost 3.1s of LCP render delay.
    Slide one is always rendered normally, so the hero is complete without
    JavaScript; the rest are alternative photographs of the same institution
    and carry no information of their own."""
    """Render a <picture>. `ratio` (e.g. "16/9") pins the box so the layout is
    stable before the image arrives, and object-position honours the focal
    point so a tight crop keeps the subject in frame.

    `prefix` is the caller's relative path back to the site root. The pipeline
    stores every URL as "assets/img/...", which only resolves from a page at
    the root; on a section landing page one level down it pointed at
    academics/assets/img/... and the masthead photograph silently 404'd on all
    six hubs, leaving the blur placeholder on screen."""
    if not meta:
        return ""
    fx, fy = rec.get("focal", (50, 50))
    style = f"object-position:{fx}% {fy}%"
    if meta.get("lqip"):
        style += f";background-image:url({meta['lqip']});background-size:cover"
    wrap_style = f"aspect-ratio:{ratio}" if ratio else ""

    attr = "data-srcset" if defer else "srcset"
    src_tags = "".join(
        f'<source type="image/{fmt}" {attr}="{_prefixed(srcset, prefix)}" sizes="{sizes}">'
        for fmt, srcset in meta.get("sources", {}).items()
    )
    loading = "eager" if priority else "lazy"
    fetch = ' fetchpriority="high"' if priority else ""
    decode = "" if priority else ' decoding="async"'

    fallback = f'{prefix}{meta["fallback"]}'
    jpeg = _prefixed(meta["jpeg"], prefix) if meta.get("jpeg") else ""

    if defer:
        img = (
            f'<img data-src="{fallback}"'
            f'{f" data-srcset={jpeg!r} sizes={sizes!r}" if jpeg else ""}'
            f' alt="{html.escape(rec["alt"], quote=True)}"'
            f' width="{meta["w"]}" height="{meta["h"]}"'
            f' loading="lazy" decoding="async" style="{style}">'
        )
    else:
        img = (
            f'<img src="{fallback}"'
            f'{f" srcset={jpeg!r} sizes={sizes!r}" if jpeg else ""}'
            f' alt="{html.escape(rec["alt"], quote=True)}"'
            f' width="{meta["w"]}" height="{meta["h"]}"'
            f' loading="{loading}"{fetch}{decode} style="{style}">'
        )

    return (
        f'<picture class="pic {cls}"{f" style={wrap_style!r}" if wrap_style else ""}>'
        f"{src_tags}{img}</picture>"
    )
