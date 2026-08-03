from pathlib import Path

root = Path(__file__).resolve().parents[1]
for path in root.rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    updated = text.replace('type="image/png" href="images/logo/favicon.svg"', 'type="image/svg+xml" href="images/logo/favicon.svg"')
    updated = updated.replace('type="image/png" href="../images/logo/favicon.svg"', 'type="image/svg+xml" href="../images/logo/favicon.svg"')
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        print(path.relative_to(root))
