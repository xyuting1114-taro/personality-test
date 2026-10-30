// 启动 cloudflared 隧道并将 URL 写入文件
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const cf = path.join(__dirname, 'node_modules', 'cloudflared', 'bin', 'cloudflared.exe');
// 如果 node_modules 里没有，用 npx 缓存里的
const cfFallback = 'C:\\Users\\16176\\AppData\\Local\\npm-cache\\_npx\\8a26fc3a61fe4212\\node_modules\\cloudflared\\bin\\cloudflared.exe';
const bin = fs.existsSync(cf) ? cf : cfFallback;

const child = spawn(bin, ['tunnel', '--url', 'http://localhost:3000'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let urlFound = false;
function handleData(data) {
  const text = data.toString();
  process.stdout.write(text);
  const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (match && !urlFound) {
    urlFound = true;
    fs.writeFileSync(path.join(__dirname, 'cf-url.txt'), match[0], 'utf-8');
    console.log('CF_URL_WRITTEN=' + match[0]);
  }
}
child.stdout.on('data', handleData);
child.stderr.on('data', handleData);
child.on('close', () => {
  if (fs.existsSync(path.join(__dirname, 'cf-url.txt'))) {
    fs.unlinkSync(path.join(__dirname, 'cf-url.txt'));
  }
  console.log('CF_CLOSED');
});
