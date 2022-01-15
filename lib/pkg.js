import fs from 'node:fs/promises';

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'));

export default pkg;
