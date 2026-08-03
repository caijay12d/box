"""Download replacement product catalog images (curated Unsplash/Pexels URLs)."""
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "images" / "products" / "web"
FOOD = ROOT / "images" / "products" / "food"

U = "https://images.unsplash.com/photo-{id}?w=1200&h=800&fit=crop&q=80"
P = "https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"

DOWNLOADS = {
    # Pharma
    WEB / "pharma-child-resistant.jpg": U.format(id="1771530072228-56adc093083f"),
    WEB / "pharma-supplement.jpg": U.format(id="1550572017-edd951aaee15"),
    WEB / "pharma-vitamin.jpg": P.format(id=5998514),
    WEB / "pharma-pill.jpg": P.format(id=9227776),
    WEB / "pharma-prescription.jpg": U.format(id="1587854694757-48a0f2e1c7e3"),
    # Beauty
    WEB / "beauty-lipstick.jpg": P.format(id=37808180),
    WEB / "beauty-cream-window.jpg": U.format(id="1571781926291-c477ebfd024b"),
    WEB / "beauty-serum-sleeve.jpg": U.format(id="1620916567147-2d2750c6381e"),
    WEB / "beauty-foundation.jpg": U.format(id="1512496015851-a29fb9665880"),
    WEB / "beauty-skincare.jpg": U.format(id="1556228578-0d85b1a4d571"),
    WEB / "beauty-hair-care.jpg": U.format(id="1527798220456-39a2c8f8b8b1"),
    # Gift
    WEB / "gift-magnetic.jpg": U.format(id="1607083206869-4c7672f72e62"),
    WEB / "gift-drawer.jpg": U.format(id="1549465220-8472a4c2e588"),
    WEB / "gift-two-piece.jpg": U.format(id="1513885535751-8b9238b07182"),
    WEB / "gift-folding.jpg": U.format(id="1586075010469-813b778ee804"),
    # Food
    FOOD / "Premium Tea Box.jpg": U.format(id="1564890369478-a8ebdcf4f64f"),
}

HEADERS = {"User-Agent": "BoxifyPack-Asset-Sync/1.0"}
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

def main():
    WEB.mkdir(parents=True, exist_ok=True)
    FOOD.mkdir(parents=True, exist_ok=True)
    for dest, url in DOWNLOADS.items():
        print(f"Downloading {dest.name} ...")
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
                data = resp.read()
            if len(data) < 8000:
                raise RuntimeError(f"file too small ({len(data)} bytes)")
            dest.write_bytes(data)
            print(f"  OK {len(data) // 1024} KB")
        except Exception as exc:
            print(f"  FAIL {exc}")

if __name__ == "__main__":
    main()
