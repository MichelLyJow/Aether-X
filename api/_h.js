const https = require('https');
const HOST = 'script-web-8d4a7-default-rtdb.asia-southeast1.firebasedatabase.app';
function get(path) {
  return new Promise((ok, no) => {
    https.get({ host: HOST, path, headers: { Accept: 'application/json' } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => ok(d));
    }).on('error', no);
  });
}
function isBrowser(h) {
  const d = h['sec-fetch-dest'], m = h['sec-fetch-mode'];
  if (d || m) return d === 'document' || m === 'navigate';
  return /mozilla/i.test(h['user-agent'] || '') && /text\/html/i.test(h['accept'] || '') && !!h['accept-language'];
}
module.exports = async (req, res, id) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const h = req.headers, br = isBrowser(h);
  if ((req.query || {}).debug === '1') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(JSON.stringify(h, null, 2) + '\n\nid: ' + id + '\ndecision: ' + (br ? 'BROWSER' : 'EXECUTOR'));
  }
  if (br) { res.setHeader('Location', 'https://' + h.host + '/'); return res.status(302).end(); }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (!/^[a-z0-9_-]{1,80}$/.test(id)) return res.status(404).send('-- loader not found');
  try {
    let code = null;
    try { code = JSON.parse(await get('/loaders/' + id + '/code.json')); } catch (e) {}
    if (typeof code !== 'string') return res.status(404).send('-- loader not found');
    return res.status(200).send(code);
  } catch (e) { return res.status(502).send('-- upstream error'); }
};
