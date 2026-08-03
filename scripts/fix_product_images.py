"""Replace product catalog images with verified premium packaging photos."""
import shutil
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "images" / "products" / "web"
FOOD = ROOT / "images" / "products" / "food"
BEAUTY = ROOT / "images" / "products" / "beauty"
PHARMA = ROOT / "images" / "products" / "pharma"
GIFT = ROOT / "images" / "products" / "gift"

U = "https://images.unsplash.com/photo-{id}?w=1200&h=800&fit=crop&q=80"

# Verified local assets (premium mockups / curated category shots)
COPIES = {
    WEB / "pharma-child-resistant.jpg": PHARMA / "child-resistant-box.jpg",
    WEB / "pharma-pill.jpg": PHARMA / "flip-top-pill-box.jpg",
    WEB / "pharma-prescription.jpg": PHARMA / "vitamin-bottle-box.jpg",
    WEB / "beauty-lipstick.jpg": BEAUTY / "Lipstick Carton.jpg",
    WEB / "beauty-cream-window.jpg": BEAUTY / "Cream Box with Window.jpg",
    WEB / "beauty-serum-sleeve.jpg": BEAUTY / "Serum Sleeve.jpg",
    WEB / "beauty-foundation.jpg": BEAUTY / "Foundation Box.jpg",
    WEB / "beauty-skincare.jpg": BEAUTY / "mask box.jpg",
    WEB / "beauty-hair-care.jpg": WEB / "beauty-makeup.jpg",
    WEB / "gift-magnetic.jpg": FOOD / "Chocolate Truffle Box.jpg",
    WEB / "gift-drawer.jpg": FOOD / "Candy & Confectionery Boxes.jpg",
    WEB / "gift-two-piece.jpg": GIFT / "two-piece-rigid-box.jpg",
    WEB / "gift-folding.jpg": GIFT / "magnetic-closure-box.jpg",
}

# Verified Unsplash downloads (IDs visually checked)
DOWNLOADS = {
    WEB / "pharma-supplement.jpg": U.format(id="1771530072228-56adc093083f"),
    FOOD / "Premium Tea Box.jpg": U.format(id="1597481288323-efff1b2f6d23"),
    FOOD / "Candy & Confectionery Boxes.jpg": U.format(id="1626663082675-6be9ee82c4ba"),
    FOOD / "Chocolate Truffle Box.jpg": U.format(id="1589283467257-3c3b52945db1"),
}

HEADERS = {"User-Agent": "BoxifyPack-Asset-Sync/1.0"}
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE


def copy_asset(dest: Path, src: Path) -> None:
    if not src.is_file():
        raise FileNotFoundError(src)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    print(f"  COPY {src.name} -> {dest.relative_to(ROOT)}")


def download_asset(dest: Path, url: str) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
        data = resp.read()
    if len(data) < 8000:
        raise RuntimeError(f"file too small ({len(data)} bytes)")
    dest.write_bytes(data)
    print(f"  DL   {dest.relative_to(ROOT)} ({len(data) // 1024} KB)")


def main() -> None:
    for dest, src in COPIES.items():
        print(f"Fixing {dest.name} ...")
        copy_asset(dest, src)

    for dest, url in DOWNLOADS.items():
        print(f"Downloading {dest.name} ...")
        download_asset(dest, url)

    print("Done.")


if __name__ == "__main__":
    main()
