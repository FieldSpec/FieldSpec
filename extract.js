const { execSync } = require('child_process');
const fs = require('fs');

const content = execSync('git show 739fe27:app/(marketing)/page.tsx', { encoding: 'utf8' });
fs.writeFileSync('app/(marketing)/page.tsx', content, 'utf8');
console.log('Done');