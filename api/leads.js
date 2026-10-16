import { list, get, del } from '@vercel/blob';
const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
export default async function handler(req, res) {
  const key = process.env.LEADS_ADMIN_KEY;
  if (!key || req.query.key !== key) return res.status(401).json({ ok: false, error: 'unauthorized' });
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method === 'DELETE') {
    const email = String(req.query.email || '').toLowerCase(); if (!email) return res.status(400).json({ ok: false, error: 'email required' });
    const all = []; let c; do { const r = await list({ prefix: 'leads/', cursor: c, limit: 1000 }); all.push(...r.blobs); c = r.hasMore ? r.cursor : undefined; } while (c);
    const gone = [];
    for (const b of all) { try { const r = await get(b.pathname, { access: 'private', useCache: false }); const l = JSON.parse(await new Response(r.stream).text()); if ((l.email || '').toLowerCase() === email) { await del(b.url); gone.push(b.pathname); } } catch {} }
    return res.status(200).json({ ok: true, deleted: gone.length, gone });
  }
  const prefix = 'leads/' + (req.query.type ? String(req.query.type).replace(/[^a-z-]/g, '') + '/' : '');
  const blobs = []; let cursor;
  do { const r = await list({ prefix, cursor, limit: 1000 }); blobs.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor && blobs.length < 5000);
  blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
  const n = Math.min(+req.query.limit || 200, 1000);
  const leads = [];
  for (const b of blobs.slice(0, n)) {
    try { const r = await get(b.pathname, { access: 'private', useCache: false }); leads.push(JSON.parse(await new Response(r.stream).text())); } catch (e) { leads.push({ pathname: b.pathname, error: 'read failed' }); }
  }
  if (req.query.format === 'csv') {
    const keys = [...new Set(leads.flatMap(l => Object.keys(l.fields || {})))];
    const rows = [['receivedAt', 'type', 'name', 'email', 'page', 'country', ...keys].map(esc).join(',')].concat(leads.map(l => [l.receivedAt, l.type, l.name, l.email, l.page, l.country, ...keys.map(k => (l.fields || {})[k])].map(esc).join(',')));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8'); res.setHeader('Content-Disposition', 'attachment; filename="globus-leads.csv"');
    return res.status(200).send(rows.join('\n'));
  }
  return res.status(200).json({ ok: true, total: blobs.length, returned: leads.length, leads });
}
