'use strict';
var path = require('path');
var fs = require('fs');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var jestDiff = require('jest-diff');
var NO_DIFF_MESSAGE = require('jest-diff/build/constants').NO_DIFF_MESSAGE;
var yaml = require('js-yaml');
var childProcess = require('child_process');

function readFile(filename) {
  return fs.readFileSync(filename).toString();
}
function readJson(filename) {
  return JSON.parse(readFile(filename));
}
function diff(filename) {
  return jestDiff(readFile(filename), readFile(path.join(__dirname, '../demo', filename)), {
    expand: false
  });
}
function spawn(cmd) {
  var res = childProcess.spawnSync(cmd, {
    env: process.env,
    shell: true,
    cwd: process.cwd()
  });
  console.log('output', res.output.toString());
  console.log(res.status);
  return res.status;
}

describe('generator-npm-module-typescript:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'generator-test',
        description: 'Test description.',
        homepage: 'http://test.justso.cool',
        authorName: 'Keyon U',
        authorEmail: 'youngyou.name@gmail.com',
        authorUrl: 'https://justso.cool',
        keywords: ['test', 'yoeman'],
        includeCoveralls: true,
        githubAccount: 'youngyou',
        license: 'MIT'
      });
  });
  test('README.md', () => {
    expect(diff('README.md')).toBe(NO_DIFF_MESSAGE);
  });
  test('LICENSE', () => {
    assert.file('LICENSE');
  });
  test('package.json', () => {
    var content = readJson('package.json');
    var dist = readJson(path.join(__dirname, '../demo', 'package.json'));
    assert.deepEqual(content, dist);
  });
  test('.travis.yml', () => {
    var content = readFile('.travis.yml');
    var dist = readFile(path.join(__dirname, '../demo', '.travis.yml'));
    assert.deepEqual(yaml.safeLoad(content, 'utf8'), yaml.safeLoad(dist, 'utf8'));
  });
  test('.gitignore', () => {
    expect(diff('.gitignore')).toBe(NO_DIFF_MESSAGE);
  });
  it('.npmignore', () => {
    expect(diff('.npmignore')).toBe(NO_DIFF_MESSAGE);
  });
  it('tsconfig.json', () => {
    expect(diff('tsconfig.json')).toBe(NO_DIFF_MESSAGE);
  });
  test('tslint.json', () => {
    expect(diff('tslint.json')).toBe(NO_DIFF_MESSAGE);
  });
  test('src', () => {
    assert.fileContent('src/index.ts', 'export default (a: number, b: number): number => (a + b);');
  });
  test('tests', () => {
    assert.file('tests/index.spec.ts');
  });

  ['npm install', 'npm run clean', 'npm run build', 'npm test', 'npm run coverage'].reduce((p, script) => {
    var _p = new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      test(`${script}`, () => {
        console.log(`spawn ${script}, this may spend some time.`);
        expect(spawn(script)).toBe(0);
        resolve();
      });
    });
    return p.then(() => _p);
  }, Promise.resolve());
});
