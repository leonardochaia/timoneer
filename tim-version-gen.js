const {
  version
} = require('./package.json');

const fs = require('fs');
const path = 'src/tim-version.ts';

let gitBranch, gitCommit;
if (process.env.TRAVIS) {
  gitCommit = process.env.TRAVIS_BRANCH;
  gitBranch = process.env.TRAVIS_COMMIT;
} else {
  const git = require('git-rev-sync');
  gitCommit = git.short();
  gitBranch = git.branch();
}
const contents = `
// This file is auto-generated. Do not edit.
export const timoneerVersion = {
  /** ${version} */
  version: '${version}',
  git: {
    /** ${gitCommit} */
    short: '${gitCommit}',
    /** ${gitBranch} */
    branch: '${gitBranch}',
  }
};
`;

console.info(`About to save ${path}`);
console.log(contents);

fs.writeFile(path, contents, {
  flag: 'w'
}, function (err) {
  if (err) throw err;
  console.info(`${path} saved.`);
});
