const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
let content = fs.readFileSync(seedPath, 'utf8');

// Replace all .png with .svg in the seed file
content = content.replace(/\.png/g, '.svg');

fs.writeFileSync(seedPath, content, 'utf8');
console.log('🎉 prisma/seed.ts updated to use .svg images!');
