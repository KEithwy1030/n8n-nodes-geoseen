async function __geoseenPublish() {
  const name = 'n8n-nodes-geoseen', version = '0.1.0';
  const pkg = {"author":{"email":"hugo@kaimomedia.com","name":"GeoSeen"},"description":"Check how often AI assistants mention your brand. Read-only access to GeoSeen's public brand-visibility leaderboard.","files":["dist"],"homepage":"https://auditlab.site","keywords":["n8n-community-node-package","geoseen","ai-visibility","brand-mentions","geo","llm-monitoring"],"license":"MIT","n8n":{"credentials":[],"n8nNodesApiVersion":1,"nodes":["dist/nodes/GeoSeen/GeoSeen.node.js"],"strict":true},"name":"n8n-nodes-geoseen","peerDependencies":{"n8n-workflow":"*"},"repository":{"type":"git","url":"https://github.com/KEithwy1030/n8n-nodes-geoseen.git"},"version":"0.1.0"};
  const tj = await (await fetch('https://api.github.com/repos/KEithwy1030/n8n-nodes-geoseen/contents/n8n-nodes-geoseen-0.1.0.tgz')).json();
  const binStr = atob(tj.content.replace(/\n/g, ''));
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
  const buf = bytes.buffer;
  const toHex = (d) => [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
  const toB64 = (d) => { let s = ''; const u = new Uint8Array(d); for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode(...u.subarray(i, i + 8192)); return btoa(s); };
  const sha1 = toHex(await crypto.subtle.digest('SHA-1', buf));
  const integrity = 'sha512-' + toB64(await crypto.subtle.digest('SHA-512', buf));
  const b64 = toB64(buf);
  const body = {
    _id: name, name, description: pkg.description, 'dist-tags': { latest: version },
    versions: { [version]: { ...pkg, _id: name + '@' + version, dist: { shasum: sha1, tarball: 'https://registry.npmjs.org/' + name + '/-/' + name + '-' + version + '.tgz', integrity: integrity } } },
    _attachments: { [name + '-' + version + '.tgz']: { content_type: 'application/octet-stream', data: b64, length: bytes.length } }
  };
  const res = await fetch('https://registry.npmjs.org/' + encodeURIComponent(name), {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return 'PUBLISH STATUS ' + res.status + ' :: ' + text.slice(0, 600);
}
__geoseenPublish();
