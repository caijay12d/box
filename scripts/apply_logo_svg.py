"""Apply SVG logo lockup (A icon + B typography) across all HTML pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAV_OLD = re.compile(
    r'<a href="([^"]*)" class="nav-logo">\s*'
    r'<img src="([^"]*logo \(1\)\.png)" alt="BoxifyPack" class="nav-logo-img">\s*'
    r"</a>",
    re.MULTILINE,
)

FOOTER_OLD = re.compile(
    r'<div class="footer-logo">\s*'
    r'<img src="([^"]*logo \(1\)\.png)" alt="BoxifyPack" class="footer-logo-img">\s*'
    r"</div>",
    re.MULTILINE,
)


def nav_repl(match: re.Match) -> str:
    href = match.group(1)
    src = match.group(2)
    prefix = src.rsplit("images/logo/", 1)[0] + "images/logo/"
    return (
        f'<a href="{href}" class="nav-logo" aria-label="BoxifyPack">\n'
        f'        <img src="{prefix}cp.svg" alt="" class="nav-logo-icon" width="32" height="40">\n'
        f'        <span class="nav-logo-text">Boxify<em>Pack</em></span>\n'
        f"      </a>"
    )


def footer_repl(match: re.Match) -> str:
    src = match.group(1)
    prefix = src.rsplit("images/logo/", 1)[0] + "images/logo/"
    return (
        f'<div class="footer-logo">\n'
        f'            <img src="{prefix}cp.svg" alt="" class="footer-logo-icon" width="28" height="35">\n'
        f'            <span class="footer-logo-text">Boxify<em>Pack</em></span>\n'
        f"          </div>"
    )


def main() -> None:
    for path in ROOT.rglob("*.html"):
        if path.name == "logo-preview.html":
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        text = NAV_OLD.sub(nav_repl, text)
        text = FOOTER_OLD.sub(footer_repl, text)
        text = text.replace(
            'href="images/logo/favicon-with-bg.png"',
            'href="images/logo/favicon.svg"',
        )
        text = text.replace(
            'href="../images/logo/favicon-with-bg.png"',
            'href="../images/logo/favicon.svg"',
        )
        if text != orig:
            path.write_text(text, encoding="utf-8")
            print("Updated", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
