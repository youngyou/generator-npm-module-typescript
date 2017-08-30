# generator-test [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Test description.

## Getting started
- Install: `npm install generator-test --save`

## Useful commands:
    npm run clean          - clean the last build
    npm run build          - build the library files
    npm run test           - run the tests
    npm run test:watch     - run the tests (watch-mode)
    npm run coverage       - run the tests with coverage
    npm run coverage:watch - run the tests with coverage (watch-mode)
    npm run pack           - build the library, make sure the tests passes, and then pack the library (creates .tgz)
    npm run release        - prepare package for next release

## Output files explained:
    1. node_modules                       - directory npm creates with all the dependencies of the module (result of npm install)
    2. lib                                - directory contains the compiled library (javascript + typings)
    3. *.tgz - final tgz file for publish. (result of npm run pack)
    4. coverage                           - code coverage report output made by istanbul

## License

MIT © [Keyon U](https://justso.cool)


[npm-image]: https://badge.fury.io/js/generator-test.svg
[npm-url]: https://npmjs.org/package/generator-test
[travis-image]: https://travis-ci.org/youngyou/generator-test.svg?branch=master
[travis-url]: https://travis-ci.org/youngyou/generator-test
[daviddm-image]: https://david-dm.org/youngyou/generator-test.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/youngyou/generator-test
[coveralls-image]: https://coveralls.io/repos/youngyou/generator-test/badge.svg
[coveralls-url]: https://coveralls.io/r/youngyou/generator-test
