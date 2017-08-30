## Getting started
- Install: `npm install <%= name %> --save`

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
