import { put } from '@vercel/blob';
const TYPES = ['newsletter', 'financing', 'screener', 'feasibility-report', 'sponsor'];
const clean = v => String(v ?? '').slice(0, 4000).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'POST only' }); }
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  if (b._hp) return res.status(200).json({ ok: true }); // honeypot: silently drop bots
  const type = TYPES.includes(b.type) ? b.type : 'other';
  const email = clean(b.email).toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  const fields = {};
  for (const [k, v] of Object.entries(b.fields || {}).slice(0, 40)) fields[clean(k).slice(0, 80)] = clean(v);
  const lead = { type, email, name: clean(b.name), page: clean(b.page), fields, receivedAt: new Date().toISOString(), ua: clean(req.headers['user-agent']).slice(0, 200), country: clean(req.headers['x-vercel-ip-country']) };
  const id = `${lead.receivedAt.replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    await put(`leads/${type}/${id}.json`, JSON.stringify(lead, null, 2), { access: 'private', contentType: 'application/json', addRandomSuffix: false });
  } catch (e) { console.error('blob put failed', e); return res.status(500).json({ ok: false, error: 'storage' }); }
  // Free email notification via FormSubmit (no account; one-time activation by the recipient)
  let notified = false;
  try {
    const to = process.env.LEADS_NOTIFY_EMAIL || 'Craig@globuscapitaladvisors.com';
    const payload = { _subject: `New ${type} lead: ${lead.name || email}`, _template: 'table', _captcha: 'false', _replyto: email, Type: type, Name: lead.name, Email: email, Page: lead.page, ...fields };
    if (type === 'financing' || type === 'feasibility-report') payload._autoresponse = `Thank you${lead.name ? ', ' + lead.name : ''}. Globus Capital Advisors received your request and will reply within one business day. For anything urgent, email Craig@globuscapitaladvisors.com. This message is an automatic acknowledgment, not a commitment to lend.`;
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: 'https://ai.globuscapitaladvisors.com/' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(6000) });
    const j = await r.json().catch(() => ({}));
    notified = r.ok && String(j.success) === 'true';
    if (!notified) console.warn('notify not confirmed', r.status, j);
  } catch (e) { console.warn('notify failed', e?.message); }
  return res.status(200).json({ ok: true, id, notified });
}
