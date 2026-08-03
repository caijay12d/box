"""Trace and normalize logo icon to compact SVG."""
from pathlib import Path

import numpy as np
from PIL import Image
from skimage import measure
from skimage.measure import approximate_polygon

ROOT = Path(__file__).resolve().parents[1]
ICON = ROOT / "images" / "logo" / "_icon-crop.png"

for name, fill in [("icon-hex-b.svg", "#ffffff"), ("icon-hex-b-green.svg", "#1a4d42")]:
    im = Image.open(ICON).convert("RGBA")
    arr = np.array(im)
    mask = arr[:, :, 3] > 10
    ys, xs = np.where(mask)
    minx, maxx = int(xs.min()), int(xs.max())
    miny, maxy = int(ys.min()), int(ys.max())
    crop = mask[miny : maxy + 1, minx : maxx + 1]

    contours = measure.find_contours(crop.astype(float), 0.5)
    contour = max(contours, key=len)
    contour = approximate_polygon(contour, tolerance=1.2)

    d_parts = []
    for i, (y, x) in enumerate(contour):
        d_parts.append(f"{'M' if i == 0 else 'L'}{x + minx:.2f},{y + miny:.2f}")
    d = " ".join(d_parts) + " Z"

    w = maxx - minx + 1
    h = maxy - miny + 1
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{minx} {miny} {w} {h}" fill="none" aria-hidden="true">
  <path d="{d}" fill="{fill}"/>
</svg>
"""
    out = ROOT / "images" / "logo" / name
    out.write_text(svg, encoding="utf-8")
    print(f"Wrote {out.name} viewBox={minx},{miny},{w},{h}")
