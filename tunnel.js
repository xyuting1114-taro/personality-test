// 使用 localtunnel 程序化建立公网隧道并输出 URL
const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });
  console.log('TUNNEL_URL=' + tunnel.url);
  fs.writeFileSync(path.join(__dirname, 'tunnel-url.txt'), tunnel.url, 'utf-8');
  tunnel.on('close', () => { console.log('TUNNEL_CLOSED'); fs.unlinkSync(path.join(__dirname, 'tunnel-url.txt')); });
  tunnel.on('error', (err) => console.error('TUNNEL_ERROR', err.message));
})();
