"""Golden Frontend Reference v1 portability smoke test: the independent consumer demo (examples/consumer-demo/), one browser.
usage: python tools/golden_consumer_smoke.py <outdir>"""
import sys, json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(r'C:\DesignLab\MultipleCorp-Golden-Reference')
OUT = Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
URL = (ROOT / 'examples' / 'consumer-demo' / 'index.html').as_uri()
results = []


def check(name, cond, detail=''):
    results.append(bool(cond)); print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  (' + str(detail)[:600] + ')'))


with sync_playwright() as p:
    b = p.chromium.launch()
    for (w, h) in [(1366, 768), (390, 844)]:
        ctx = b.new_context(viewport={'width': w, 'height': h}, is_mobile=w < 768, has_touch=w < 768)
        pg = ctx.new_page(); errs = []; reqs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('request', lambda r: reqs.append(r.url))
        pg.goto(URL); pg.wait_for_timeout(900)
        txt = pg.evaluate("document.body.innerText")
        loaded = [u.split('/MultipleCorp-Golden-Reference/')[-1] for u in reqs if u.startswith('file:')]
        check('%d: loads with no page errors; brand "Toko Contoh"; no MULTIPLECORP fixture / domain / business module requested' % w,
              not errs and 'Toko Contoh' in txt and not any(('fixtures/' in u) or ('modules/' in u) or ('docs.js' in u) or ('composer.js' in u) for u in loaded), f'{errs} {loaded}')
        check('%d: no MULTIPLECORP wording on the consumer page' % w, not any(wd in txt for wd in ('MultipleCorp', 'Proyek', 'Penawaran', 'Gudang', 'ARJ/')), txt[:300])
        check('%d: Golden tokens + components apply (brand token from the demo config, mc-card surface, pt-list)' % w,
              pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim()") == '#1d4f5c' and pg.evaluate("!!document.querySelector('.mc-card.pt-section .pt-list')"))
        if w == 1366:
            n1 = pg.evaluate("[...document.querySelectorAll('[data-mount=list] tbody .pt-col-no')].map(x => x.textContent.trim())")
            pg.click('[data-mount=list] [data-pager-go="2"]'); pg.wait_for_timeout(300)
            n2 = pg.evaluate("[[...document.querySelectorAll('[data-mount=list] tbody .pt-col-no')].map(x => x.textContent.trim()), (document.querySelector('[data-mount=list] .pt-pager__range') || {}).textContent]")
            check('1366: numbered + paginated list: page 1 = 1..10, page 2 = 11..20 ("Menampilkan 11–20 dari 23 pesanan"); statuses render as the text status', n1 == [str(i) for i in range(1, 11)] and n2[0] == [str(i) for i in range(11, 21)] and '11–20 dari 23 pesanan' in (n2[1] or '') and pg.evaluate("document.querySelectorAll('[data-mount=list] .mc-status').length") >= 10, f'{n1} {n2}')
            pg.click('[data-demo-form] [type=submit]'); pg.wait_for_timeout(250)
            v1 = pg.evaluate("[document.querySelector('[data-mount=checks]').innerText, document.querySelector('#demo-name').getAttribute('aria-invalid'), document.activeElement.id]")
            pg.fill('#demo-name', 'Sinta'); pg.fill('#demo-email', 'salah-format'); pg.click('[data-demo-form] [type=submit]'); pg.wait_for_timeout(250)
            v2 = pg.evaluate("[document.querySelector('[data-mount=checks]').innerText, document.querySelector('#demo-email').getAttribute('aria-invalid'), document.activeElement.id, document.querySelector('#demo-name').getAttribute('aria-invalid')]")
            pg.evaluate("(() => { const d = document.querySelector('#demo-date'); d.value = '2099-01-01'; d.dispatchEvent(new Event('change', { bubbles: true })); })()"); pg.wait_for_timeout(150)
            v3 = pg.evaluate("[document.querySelector('#demo-date').max.length === 10, (document.querySelector('#demo-date-note') || {}).textContent || '']")
            pg.evaluate("(() => { const d = document.querySelector('#demo-date'); d.value = ''; d.dispatchEvent(new Event('change', { bubbles: true })); })()")
            check('1366: validation: empty name -> summary + aria-invalid + focus; bad email -> its sentence; a future date -> the shared date rule (max today)',
                  'Isi nama pelanggan' in v1[0] and v1[1] == 'true' and v1[2] == 'demo-name' and 'Format email' in v2[0] and v2[1] == 'true' and v2[2] == 'demo-email' and v2[3] is None and v3[0] and 'tidak boleh setelah hari ini' in v3[1], f'{v1} {v2} {v3}')
            pg.fill('#demo-email', 'sinta@contoh.example'); pg.click('[data-demo-form] [type=submit]'); pg.wait_for_timeout(400)
            dlg = pg.evaluate("[!!document.querySelector('.mc-modal-layer .mc-modal'), (document.querySelector('.mc-modal-layer') || {}).innerText || '', document.activeElement.textContent.trim()]")
            pg.screenshot(path=str(OUT / 'consumer-dialog-1366.png'))
            pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
            esc_ = pg.evaluate("[!!document.querySelector('.mc-modal-layer .mc-modal'), !document.querySelector('[data-demo-form]').hidden]")
            pg.click('[data-demo-form] [type=submit]'); pg.wait_for_timeout(400); pg.click('.mc-modal-layer [data-modal-ok]'); pg.wait_for_timeout(500)
            res = pg.evaluate("[(document.querySelector('.pt-result__title') || {}).textContent, document.activeElement.className, [...document.querySelectorAll('.mc-flow .mc-step')].map(s => s.className.replace('mc-step', '').trim())]")
            check('1366: dialog: confirmation opens (accessible, focus inside), Esc cancels without saving; confirming shows the success result (focus on its heading) and the stepper reaches its final stage',
                  dlg[0] and 'Simpan pelanggan Sinta?' in dlg[1] and dlg[2] in ('Kembali', 'Simpan') and esc_ == [False, True] and res[0] == 'Pelanggan Sinta tersimpan.' and 'pt-result__title' in res[1] and 'is-current' in res[2][2], f'{dlg} {esc_} {res}')
            pg.screenshot(path=str(OUT / 'consumer-result-1366.png'))
            pg.goto(URL); pg.wait_for_timeout(800)
            pg.keyboard.press('Tab'); pg.wait_for_timeout(100)
            kb = pg.evaluate("[document.activeElement.className, getComputedStyle(document.activeElement).opacity, [...document.querySelectorAll('input, select, textarea')].filter(i => i.type !== 'hidden' && !i.closest('[hidden]') && !(i.labels && i.labels.length) && !i.getAttribute('aria-label')).length]")
            check('1366: keyboard: the first Tab reaches the visible skip link; every visible form control has a label', 'shell-skip' in kb[0] and kb[1] == '1' and kb[2] == 0, str(kb))
            pg.screenshot(path=str(OUT / 'consumer-1366.png'), full_page=True)
        else:
            mob = pg.evaluate("[document.documentElement.scrollWidth - innerWidth, [...document.querySelectorAll('[data-mount=list] .pt-row__no')].map(x => x.textContent), !!document.querySelector('.mc-bottom-nav'), Math.min(...[...document.querySelectorAll('[data-mount=list] .pt-pager__btn')].map(b => b.getBoundingClientRect().height))]")
            check('390: no sideways scroll; phone cards numbered 1..10; bottom navigation present; pager buttons are 44 px targets', mob[0] <= 1 and mob[1] == [str(i) for i in range(1, 11)] and mob[2] and mob[3] >= 44, str(mob))
            pg.screenshot(path=str(OUT / 'consumer-390.png'), full_page=True)
        check('%d: no page errors during the run' % w, not errs, '; '.join(errs[:2]))
        ctx.close()
    b.close()
print(str(sum(results)) + '/' + str(len(results)) + ' checks passed')
