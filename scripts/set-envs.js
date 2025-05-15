const { writeFileSync, mkdirSync } = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const urlMap = process.env['URL_MAP']

if (!urlMap) {
    throw new Error('URL_MAP is not defined');
}


const envFileContent = `

export const environment = {
    urlMap: "${urlMap}",
}
`


mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);