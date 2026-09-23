const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    fs.statSync(p).isDirectory() ? walkDir(p, callback) : callback(p);
  });
}

walkDir(path.join(__dirname, 'src'), f => {
  if (!f.endsWith('.ts') && !f.endsWith('.tsx')) return;
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('\\${import.meta.env.VITE_API_URL')) {
    c = c.replace(/\\\$\{import.meta.env.VITE_API_URL/g, '${import.meta.env.VITE_API_URL');
    fs.writeFileSync(f, c);
    console.log('Fixed', f);
  }
});
