"""Golden Frontend Reference v1.0.0 - public smoke test (distribution file, NOT part of the frozen baseline).

Runs the frozen consumer-demo smoke test, tools/golden_consumer_smoke.py, from any clone or copy of this
repository. The frozen script names the private lab folder in two literals: its ROOT line and the request-path
prefix. This adapter:
  1. checks that tools/golden_consumer_smoke.py is byte-identical to the frozen v1.0 file (SHA-256 from
     release/golden-frontend-v1.0/SHA256SUMS-scope.txt);
  2. replaces only those two literals, in memory, with the location of this clone;
  3. runs the unchanged frozen checks (13 checks, desktop 1366 x 768 and phone 390 x 844).
The frozen file itself is never modified. Output: console report plus screenshots in <outdir>.

usage:  python tools/public_consumer_smoke.py [outdir]     (default: evidence/public-smoke, ignored by Git)
needs:  Python 3.8+ with Playwright for Python and its Chromium:
            python -m pip install playwright
            python -m playwright install chromium
exit:   0 = all checks passed   1 = a check failed   2 = cannot run (Playwright / Chromium missing, or the
        frozen smoke test is not the v1.0 file)
"""
import hashlib
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
FROZEN = ROOT / 'tools' / 'golden_consumer_smoke.py'
SUMS = ROOT / 'release' / 'golden-frontend-v1.0' / 'SHA256SUMS-scope.txt'
LAB_ROOT_LINE = "ROOT = Path(r'C:\\DesignLab\\MultipleCorp-Golden-Reference')"
LAB_URL_PART = "'/MultipleCorp-Golden-Reference/'"
INSTALL_HINT = 'python -m pip install playwright  and  python -m playwright install chromium'


def cannot_run(message):
    print('CANNOT RUN: ' + message)
    sys.exit(2)


def frozen_sha256():
    for line in SUMS.read_text(encoding='utf-8').splitlines():
        parts = line.strip().split(None, 1)
        if len(parts) == 2 and parts[1].lstrip('*') == 'tools/golden_consumer_smoke.py':
            return parts[0].lower()
    cannot_run('tools/golden_consumer_smoke.py is not listed in release/golden-frontend-v1.0/SHA256SUMS-scope.txt')


def main():
    try:
        sys.stdout.reconfigure(errors='replace')        # the frozen checks print non-ASCII text
    except (AttributeError, ValueError):
        pass
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'evidence' / 'public-smoke'
    try:
        import playwright.sync_api  # noqa: F401
    except ImportError:
        cannot_run('Playwright for Python is not installed. Install it with: ' + INSTALL_HINT)
    raw = FROZEN.read_bytes()
    if hashlib.sha256(raw).hexdigest() != frozen_sha256():
        cannot_run('tools/golden_consumer_smoke.py is not the frozen v1.0 file; this adapter runs only the frozen test.')
    source = raw.decode('utf-8')
    if source.count(LAB_ROOT_LINE) != 1 or source.count(LAB_URL_PART) != 1:
        cannot_run('the frozen smoke test does not contain the expected lab-path literals.')
    source = source.replace(LAB_ROOT_LINE, 'ROOT = Path(%r)' % str(ROOT))
    source = source.replace(LAB_URL_PART, repr('/' + quote(ROOT.name) + '/'))
    print('Golden consumer smoke test (frozen v1.0 checks) | package: %s | output: %s' % (ROOT, out))
    sys.argv = [str(FROZEN), str(out)]
    scope = {'__name__': '__main__', '__file__': str(FROZEN)}
    try:
        exec(compile(source, str(FROZEN), 'exec'), scope)
    except Exception as error:                          # noqa: BLE001 - report and classify, never a bare traceback
        text = str(error)
        if "Executable doesn't exist" in text or 'playwright install' in text:
            cannot_run('Chromium for Playwright is not installed. Install it with: ' + INSTALL_HINT)
        first = text.splitlines()[0][:400] if text else repr(error)
        print('FAIL the smoke test stopped with an error: ' + first)
        sys.exit(1)
    results = scope.get('results') or []
    sys.exit(0 if results and all(results) else 1)


if __name__ == '__main__':
    main()
