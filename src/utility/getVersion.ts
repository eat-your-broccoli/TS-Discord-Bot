import * as fs from 'fs';

function getVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.promises.readFile('./package.json').then((data) => {
      const parsed = JSON.parse(data.toString());
      const { version } = parsed;
      resolve(version);
    })
      .catch((err) => reject(err));
  });
}

export default getVersion;
