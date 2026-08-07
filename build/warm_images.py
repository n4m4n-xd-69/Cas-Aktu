"""Pre-encode every manifest image at every tier it may be requested at, so
the first real build is fast. Safe to re-run: cached entries are skipped."""
import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from data.images import HERO, all_images
from imagepipe import ImagePipeline, HERO_W, BAND_W, HALF_W, CARD_W, THUMB_W

root = Path(__file__).resolve().parent.parent
p = ImagePipeline(root)
hero_src = {r["src"] for r in HERO}
t0 = time.time()
for i, rec in enumerate(all_images(), 1):
    tiers = [HERO_W, BAND_W, HALF_W, CARD_W, THUMB_W] if rec["src"] in hero_src \
            else [BAND_W, HALF_W, CARD_W, THUMB_W]
    for w in tiers:
        p.process(rec["src"], w)
    p.save()
    print(f"[{i:2}/{len(all_images())}] {rec['src'][:44]:44} {time.time()-t0:6.1f}s", flush=True)
p.save()
print(f"done in {time.time()-t0:.0f}s  encoded={p.stats['encoded']} cached={p.stats['cached']}")
