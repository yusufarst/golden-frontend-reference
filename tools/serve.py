"""Local, read-only web server for the Golden Reference lab (r13 persistent shell, D-52).

  python tools/serve.py [--port 8137] [--open] [--quiet]
  serve.cmd                                   (lab root, Windows double-click: --open on port 8137)

Serves the lab root on http://127.0.0.1:<port>/ (default 8137; --port or the MC_PORT environment variable
override it). Over HTTP the app's router (assets/js/router.js) swaps pages in place: the sidebar, the account
block and the top bar stay mounted while only the page changes. Opened from disk (file://) every page is still
a full document load.

Contract (R13_SPEC §1):
  - binds 127.0.0.1 only; requests whose Host is not a loopback name are refused (no DNS rebinding);
  - GET / HEAD only (read-only: other methods answer 405), no directory listings (404);
  - Cache-Control: no-cache on every answer (edits show on the next navigation without a hard reload);
  - correct types for .html .js .css .svg .webp .png .json .woff2 (charset utf-8 on text);
  - an unknown pages/*.html answers 404 with pages/00-tidak-ditemukan.html (the app's own not-found page);
  - stdlib only (http.server). In-process use (tools/router_check.py): start(port=0) -> (server, thread, port).
Port handling (r13 fix pass 2):
  - the port comes from --port, else MC_PORT, else 8137; it must be a whole number 1-65535 — anything else
    (text, spaces only, 0, out of range, negative) stops with a message naming the value and its source (exit 2),
    never a traceback and never a silent fallback to another port; an empty MC_PORT counts as not set (r13 fix
    round 2: spaces only are refused);
  - port taken by another program: a message naming the port, how to free it and how to choose another one
    (exit 2); a port Windows reserves / forbids (WSAEACCES) says so and how to list the reserved ranges;
  - the lab server itself already runs there (double-click twice): it says so and, with --open (serve.cmd
    always passes it), opens the browser at the RUNNING server (exit 0);
  - IPv6: the server listens on 127.0.0.1 only (the address it prints and opens). When another program holds
    [::1]:<port>, "http://localhost:<port>/" may reach that program, so it warns and names the 127.0.0.1 address;
  - Ctrl+C (or closing the window): "Server dihentikan." and exit 0 at once, also with a connection still open
    (a browser preconnect; block_on_close = False, daemon threads); a client that drops a connection never
    prints a traceback. serve.cmd starts this server in its OWN console window (start ... --window), so Ctrl+C
    closes that window without cmd's "Terminate batch job (Y/N)?" question; with --window a failure waits for
    Enter so its message can be read, and "already running" closes by itself after 4 s.
Test seam: MC_SERVE_BROWSER=print prints "BROWSER <url>" instead of opening a browser; MC_SERVE_BROWSER=none skips it.
"""
import argparse
import errno
import functools
import http.server
import os
import re
import socket
import sys
import threading
import time
import urllib.parse
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
DEFAULT_PORT = 8137
START_PAGE = 'pages/02-owner-dashboard.html'
NOT_FOUND_PAGE = os.path.join('pages', '00-tidak-ditemukan.html')
LAB_HEADER = 'X-MC-Lab'
LAB_VALUE = 'golden-reference'
LOOPBACK = {'127.0.0.1', 'localhost', '[::1]', '::1'}
PAGE_RE = re.compile(r'^/pages/[^/]+\.html$')
TYPES = {
    '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
    '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf',
    '.mp4': 'video/mp4', '.webm': 'video/webm',
}

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, ValueError):
        pass


class LabHandler(http.server.SimpleHTTPRequestHandler):
    server_version = 'MCGoldenLab/1.0'
    sys_version = ''
    quiet = False

    # ---- policy ------------------------------------------------------------------------------
    def _host_ok(self):
        host = (self.headers.get('Host') or '').strip()
        if host.startswith('['):
            name = host.split(']')[0] + ']'
        else:
            name = host.split(':')[0]
        return name.lower() in LOOPBACK

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header(LAB_HEADER, LAB_VALUE)
        super().end_headers()

    def guess_type(self, path):
        return TYPES.get(os.path.splitext(path)[1].lower(), 'application/octet-stream')

    def list_directory(self, path):          # no listings
        self.send_error(404, 'Not found')
        return None

    def send_head(self):
        if not self._host_ok():
            self.send_error(403, 'Forbidden host')
            return None
        url_path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
        fs_path = self.translate_path(self.path)
        if PAGE_RE.match(url_path) and not os.path.isfile(fs_path):
            return self._file(os.path.join(self.directory, NOT_FOUND_PAGE), 404)
        return super().send_head()

    def _file(self, path, status):
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, 'Not found')
            return None
        size = os.fstat(f.fileno()).st_size
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(size))
        self.end_headers()
        return f

    def _read_only(self):
        self.send_response(405)
        self.send_header('Allow', 'GET, HEAD')
        self.send_header('Content-Length', '0')
        self.end_headers()

    do_POST = do_PUT = do_DELETE = do_PATCH = do_OPTIONS = _read_only

    def log_message(self, fmt, *args):
        if not self.quiet:
            sys.stderr.write('%s  %s\n' % (self.log_date_time_string(), fmt % args))


class LabServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    block_on_close = False                   # Ctrl+C / server_close never waits for keep-alive connection threads
    allow_reuse_address = False              # never share a port with another process (Windows SO_REUSEADDR)

    def server_bind(self):
        if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()

    def handle_error(self, request, client_address):
        if isinstance(sys.exc_info()[1], (ConnectionError, TimeoutError)):
            return                           # the browser dropped the connection (WinError 10053 / 10054): not an error
        super().handle_error(request, client_address)


def make_server(port=DEFAULT_PORT, root=ROOT, quiet=False):
    handler = functools.partial(type('H', (LabHandler,), {'quiet': quiet}), directory=root)
    return LabServer(('127.0.0.1', port), handler)


def start(port=0, root=ROOT, quiet=True):
    """In-process server on a free port (port=0) in a daemon thread: (server, thread, port)."""
    httpd = make_server(port, root, quiet)
    t = threading.Thread(target=httpd.serve_forever, name='mc-lab-server', daemon=True)
    t.start()
    return httpd, t, httpd.server_address[1]


def lab_already_running(port):
    try:
        with urllib.request.urlopen('http://127.0.0.1:%d/%s' % (port, START_PAGE), timeout=1.5) as r:
            return r.headers.get(LAB_HEADER) == LAB_VALUE
    except Exception:  # noqa: BLE001 - any failure means "not our server"
        return False


def open_browser(url):
    mode = (os.environ.get('MC_SERVE_BROWSER') or '').strip().lower()
    if mode == 'print':                      # test seam: no browser, the URL is printed
        print('BROWSER ' + url, flush=True)
        return
    if mode == 'none':
        return
    import webbrowser
    try:
        webbrowser.open(url, new=2)
    except Exception:  # noqa: BLE001
        print('Buka alamat ini di browser: ' + url, flush=True)


class PortError(ValueError):
    pass


def parse_port(text, source):
    """A port is a whole number 1-65535 (surrounding spaces allowed); anything else is a PortError naming it."""
    t = str(text).strip()
    if not (t.isascii() and t.isdigit()) or not 1 <= int(t) <= 65535:
        raise PortError('Port tidak valid: "%s" (dari %s). Pakai angka 1–65535, misalnya 8140.' % (str(text), source))
    return int(t)


def ipv6_loopback_taken(port):
    """True when some program accepts connections on [::1]:<port> (we listen on 127.0.0.1 only)."""
    if not socket.has_ipv6:
        return False
    try:
        with socket.create_connection(('::1', port), timeout=0.4):
            return True
    except OSError:
        return False


def main():
    ap = argparse.ArgumentParser(description='Read-only local server for the Golden Reference lab (127.0.0.1).')
    ap.add_argument('--port', default=None, help='port 1-65535 (default %d, or the MC_PORT environment variable)' % DEFAULT_PORT)
    ap.add_argument('--open', action='store_true', help='open the start page in the default browser')
    ap.add_argument('--quiet', action='store_true', help='no request log')
    ap.add_argument('--window', action='store_true', help='(serve.cmd) the server has its own console window: after a failure it '
                    'waits for Enter so the message can be read; "already running" closes by itself after a few seconds')
    args = ap.parse_args()
    env_port = os.environ.get('MC_PORT')
    try:
        if args.port is not None:
            port = parse_port(args.port, '--port')
        elif env_port is not None and env_port != '':
            # r13 fix round 2: only an EMPTY MC_PORT counts as not set (cmd's `set MC_PORT=` removes it anyway); a value
            # of spaces only is not a port number and is refused like any other text (never a silent 8137)
            port = parse_port(env_port, 'MC_PORT')
        else:
            port = DEFAULT_PORT
    except PortError as e:
        print(str(e))
        print('  Contoh:  set MC_PORT=8140  lalu  serve.cmd   (atau: python tools\\serve.py --port 8140)')
        return 2
    base = 'http://127.0.0.1:%d/' % port
    url = base + START_PAGE
    try:
        httpd = make_server(port, ROOT, args.quiet)
    except OSError as e:
        code = getattr(e, 'winerror', None) or e.errno
        in_use = code in (errno.EADDRINUSE, getattr(errno, 'WSAEADDRINUSE', 10048), 10048)
        denied = code in (errno.EACCES, getattr(errno, 'WSAEACCES', 10013), 10013)
        if (in_use or denied) and lab_already_running(port):
            print('Server lab sudah berjalan di %s (jendela lain).' % base)
            if args.open:
                print('Membuka browser ke server yang sedang berjalan: ' + url, flush=True)
                open_browser(url)
            if args.window:
                print('Jendela ini menutup sendiri.', flush=True)
                time.sleep(4)
            return 0
        if in_use:
            print('Port %d sudah dipakai program lain.' % port)
            print('  - Tutup program / jendela server yang memakai port %d, lalu jalankan lagi; atau' % port)
            print('  - pakai port lain:  set MC_PORT=8140  lalu  serve.cmd   (atau: python tools\\serve.py --port 8140)')
            print('  Cek pemakainya:  netstat -ano | findstr :%d' % port)
            return 2
        if denied:
            print('Port %d tidak boleh dipakai di komputer ini (dicadangkan Windows atau diblokir).' % port)
            print('  - pakai port lain:  set MC_PORT=8140  lalu  serve.cmd   (atau: python tools\\serve.py --port 8140)')
            print('  Lihat rentang yang dicadangkan:  netsh interface ipv4 show excludedportrange protocol=tcp')
            return 2
        print('Server tidak bisa dimulai di port %d: %s' % (port, e))
        return 2
    print('MultipleCorp Golden Reference — server lokal (hanya baca)')
    print('  Alamat : %s   (mulai: %s)' % (base, url))
    print('  Folder : %s' % ROOT)
    print('  Navigasi tanpa muat ulang aktif lewat alamat ini; file:// tetap memuat halaman penuh.')
    print('  Hentikan: tutup jendela ini atau tekan Ctrl+C.')
    if ipv6_loopback_taken(port):
        print('  Catatan: program lain memakai [::1]:%d, jadi http://localhost:%d/ bisa membuka program itu.' % (port, port))
        print('           Pakai alamat %s (server ini hanya mendengarkan 127.0.0.1).' % base)
    sys.stdout.flush()
    if args.open:
        t = threading.Timer(0.4, open_browser, args=(url,))
        t.daemon = True
        t.start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Server dihentikan.', flush=True)
    finally:
        httpd.server_close()
    return 0


if __name__ == '__main__':
    try:
        rc = main()
    except KeyboardInterrupt:                # Ctrl+C before the server loop (start-up) or during the shutdown
        print('Server dihentikan.', flush=True)
        rc = 0
    if rc and '--window' in sys.argv[1:]:    # serve.cmd: its own window would close before the message is read
        print('')
        print('Tekan Enter untuk menutup jendela ini.', flush=True)
        try:
            input()
        except (EOFError, KeyboardInterrupt):
            pass
    sys.exit(rc)
