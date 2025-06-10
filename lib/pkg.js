import fs from 'node:fs';

// eslint-disable-next-line n/no-sync
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

export default pkg;
