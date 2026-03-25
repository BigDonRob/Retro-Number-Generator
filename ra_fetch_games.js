/**
 * RA Game Fetcher
 *
 * Run once in the browser console on retroachievements.org (while logged in).
 * Downloads two files — drop both next to ra_rng_picker.html:
 *
 *   ra_games.js      — games that HAVE an achievement set  (player mode)
 *   ra_games_dev.js  — games that DO NOT have a set        (dev mode)
 */
(async function () {

  const PAGE_SIZE = 200;
  const DELAY_MS  = 150;   // pause between requests — be polite

  // ── Helpers ──────────────────────────────────────────────────────────────
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const log   = msg => console.log(`%c[RA Fetch] %c${msg}`,
    'color:#f5c842;font-weight:bold', 'color:#ccc');

  // RA prefixes non-retail entries with ~Category~ in the title
  const TYPE_RE = /^~([^~]+)~\s*/;
  const getType  = title => { const m = TYPE_RE.exec(title); return m ? m[1] : 'Retail'; };
  const getTitle = title => title.replace(TYPE_RE, '').trim();

  // ── Fetch one page ────────────────────────────────────────────────────────
  async function fetchPage(pageNum) {
    const url = new URL('https://retroachievements.org/games');
    url.searchParams.set('page[size]',                   PAGE_SIZE);
    url.searchParams.set('page[number]',                 pageNum);
    url.searchParams.set('filter[achievementsPublished]','either');

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        if (attempt === 0) { await sleep(1000); }
        else { log(`✗ page ${pageNum} failed: ${err.message}`); return null; }
      }
    }
  }

  // ── Parse items ───────────────────────────────────────────────────────────
  function parseItem(item) {
    const g = item?.game ?? item;  // handle both {game:{...}} and flat shapes
    if (!g?.id || !g?.system) return null;
    return {
      id:       g.id,
      title:    getTitle(g.title ?? ''),
      system:   g.system?.name  ?? g.system,
      systemId: g.system?.id    ?? g.systemId ?? 0,
      type:     getType(g.title ?? ''),
      hasSet:   (g.achievementsPublished ?? g.pointsTotal ?? 0) > 0,
    };
  }

  // ── Main loop ─────────────────────────────────────────────────────────────
  log('Starting — stay on this tab…');

  const first = await fetchPage(1);
  if (!first) { log('✗ Could not reach page 1. Are you logged in?'); return; }

  const lastPage = first.lastPage ?? first.meta?.lastPage ?? 1;
  log(`${(first.total ?? first.meta?.total ?? '?').toLocaleString()} games · ${lastPage} pages`);

  const all = (first.items ?? first.data ?? []).map(parseItem).filter(Boolean);

  for (let p = 2; p <= lastPage; p++) {
    await sleep(DELAY_MS);
    const json = await fetchPage(p);
    if (json) {
      (json.items ?? json.data ?? []).forEach(item => {
        const g = parseItem(item);
        if (g) all.push(g);
      });
    }
    if (p % 20 === 0 || p === lastPage)
      log(`page ${p}/${lastPage} · ${all.length.toLocaleString()} collected`);
  }

  // ── Deduplicate ───────────────────────────────────────────────────────────
  const seen = new Set();
  const unique = all.filter(g => seen.has(g.id) ? false : seen.add(g.id));

  // ── Split ─────────────────────────────────────────────────────────────────
  const withSet    = unique.filter(g => g.hasSet).map(({ hasSet, ...g }) => g);
  const withoutSet = unique.filter(g => !g.hasSet).map(({ hasSet, ...g }) => g);

  log(`✓ Done — ${withSet.length.toLocaleString()} with sets · ${withoutSet.length.toLocaleString()} without`);

  // ── Download ──────────────────────────────────────────────────────────────
  function download(filename, varName, games) {
    const blob = new Blob(
      [`window.${varName}=${JSON.stringify(games)};\n`],
      { type: 'text/javascript' }
    );
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: filename,
    });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1000);
    log(`📥 ${filename} (${games.length.toLocaleString()} games)`);
  }

  download('ra_games.js',     'RA_GAMES',     withSet);
  await sleep(300);
  download('ra_games_dev.js', 'RA_GAMES_DEV', withoutSet);

})();
