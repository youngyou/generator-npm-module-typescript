'use strict';
// Const Generator = require('yeoman-generator');
// const chalk = require('chalk');
// const yosay = require('yosay');
// const mkdirp = require('mkdirp');
// Const _ = require('lodash');
// const path = require('path');

// module.exports = class extends Generator {
//   default() {
//     this.composeWith(require.resolve('generator-node/generators/app'), {
//       boilerplate: false,
//       cli: false,
//       travis: false,
//       projectRoot: 'src',
//       readme: this.fs.read(this.templatePath('_README.md'))
//     });
//   }
//   writing() {
//     this.fs.copy(
//       this.templatePath('_package.json'),
//       this.destinationPath('package.json')
//     );
//   }

//   install() {
//     this.installDependencies({ bower: false });
//   }
// };

const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');
// Const parseAuthor = require('parse-author');
const githubUsername = require('github-username');
const path = require('path');
// Const askName = require('inquirer-npm-name');
const chalk = require('chalk');
// Const pkgJson = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('travis', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include travis config'
    });

    this.option('editorconfig', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include a .editorconfig file'
    });

    this.option('license', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include a license'
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name'
    });

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'GitHub username or organization'
    });
  }

  initializing() {
    this.props = {};
  }

  _askFor() {
    const prompts = [{
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
      filter: _.kebabCase,
      validate(str) {
        return str.length > 0;
      }
    }, {
      name: 'description',
      message: 'Description',
      when: !this.props.description
    }, {
      name: 'homepage',
      message: 'Project homepage url',
      when: !this.props.homepage
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      when: !this.props.authorName,
      default: this.user.git.name(),
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      when: !this.props.authorEmail,
      default: this.user.git.email(),
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage',
      when: !this.props.authorUrl,
      store: true
    }, {
      name: 'keywords',
      message: 'Package keywords (comma to split)',
      filter(words) {
        return words.split(/\s*,\s*/g);
      }
    }, {
      name: 'includeCoveralls',
      type: 'confirm',
      message: 'Send coverage reports to coveralls',
      when: this.options.coveralls === undefined
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  _askForGithubAccount() {
    if (this.options.githubAccount) {
      this.props.githubAccount = this.options.githubAccount;
      return Promise.resolve();
    }

    return githubUsername(this.props.authorEmail)
      .then(username => username, () => '')
      .then(username => {
        return this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          default: username
        }).then(prompt => {
          this.props.githubAccount = prompt.githubAccount;
        });
      });
  }

  prompting() {
    return this._askFor()
      .then(this._askForGithubAccount.bind(this));
  }
  writing() {
    const currentPkg = this.fs.readJSON(this.templatePath('_package.json'), {});
    const kebabName = _.kebabCase(this.props.name);
    const pkg = extend(currentPkg, {
      name: kebabName,
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      main: path.join('lib', 'index.js').replace(/\\/g, '/'),
      keywords: this.props.keywords || [],
      scripts: {
        browserify: `browserify -e lib/index.js --standalone ${_.camelCase(this.props.name)} --outfile lib/${kebabName}.browser.js`
      }
    });

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    this.fs.copy(this.templatePath('_npmignore'), this.destinationPath('.npmignore'));
    this.fs.copy(this.templatePath('tslint.json'), this.destinationPath('tslint.json'));
    this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('tests'), this.destinationPath('tests'));
  }

  default() {
    const travis = {
      install: ['npm config set spin=false', 'npm install'],
      script: ['npm test'],
      sudo: false
    };
    if (this.props.includeCoveralls) {
      travis.after_script = [ // eslint-disable-line camelcase
        'npm install -g coveralls',
        'npm run coverage',
        'cat ./coverage/lcov.info | coveralls'
      ];
    }
    this.composeWith(require.resolve('generator-travis/generators/app'), {
      config: travis
    });

    if (this.options.editorconfig) {
      this.composeWith(require.resolve('generator-node/generators/editorconfig'));
    }

    this.composeWith(require.resolve('generator-node/generators/git'), {
      name: this.props.name,
      githubAccount: this.props.githubAccount
    });

    if (this.options.license) {
      this.composeWith(require.resolve('generator-license/app'), {
        name: this.props.authorName,
        email: this.props.authorEmail,
        website: this.props.authorUrl
      });
    }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith(require.resolve('generator-node/generators/readme'), {
        name: this.props.name,
        description: this.props.description,
        githubAccount: this.props.githubAccount,
        authorName: this.props.authorName,
        authorUrl: this.props.authorUrl,
        coveralls: this.props.includeCoveralls,
        content: _.template(this.fs.read(this.templatePath('_README.md')))(this.props)
      });
    }
  }

  installing() {
    this.npmInstall();
  }

  end() {
    this.log('Thanks for using Yeoman.');

    if (this.options.travis) {
      let travisUrl = chalk.cyan(`https://travis-ci.org/profile/${this.props.githubAccount || ''}`);
      this.log(`- Enable Travis integration at ${travisUrl}`);
    }

    if (this.props.includeCoveralls) {
      let coverallsUrl = chalk.cyan('https://coveralls.io/repos/new');
      this.log(`- Enable Coveralls integration at ${coverallsUrl}`);
    }
  }
};
