const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace standard string literals: 'http://localhost:3001/api/rooms' -> (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/rooms'
  // But wait, it's easier to just create a global config or just use backticks.
  // Let's replace any 'http://localhost:3001...' or "http://localhost:3001..." with `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}...`
  
  // 1. Single/Double quotes to Template literals
  const regexQuotes = /['"]http:\/\/localhost:3001(.*?)['"]/g;
  if (regexQuotes.test(content)) {
    content = content.replace(regexQuotes, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}$1`");
    changed = true;
  }

  // 2. Existing Template literals that start with http://localhost:3001
  // like `http://localhost:3001/api/sessions/${id}`
  const regexTicks = /`http:\/\/localhost:3001(.*?)`/g;
  if (regexTicks.test(content)) {
    content = content.replace(regexTicks, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}$1`");
    changed = true;
  }
  
  // 3. Fix cases like const BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`
  // which might happen in AuthService.ts and SocketService.ts
  // I will just revert AuthService and SocketService manually if they get messed up, or exclude them.
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
