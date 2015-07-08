'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function () {

    generators.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });
  },

  askFor: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {

      this.log(yosay('Alors Ca compile du ' + chalk.red(' Twig-front ') + '?'));

    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Un petit modernizr ?',
      choices: [{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }, {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Jquery ça peut servir ?',
      default: true,
      when: function (answers) {
        return answers.features
      }
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeModernizr = hasFeature('includeModernizr');
      this.includeJQuery = answers.includeJQuery;

      done();
    }.bind(this));
  },

  writing: {
      createFolders: function() {
        mkdirp("app/images");
        mkdirp("app/preview");
        mkdirp("app/scripts");
        mkdirp("app/styles");
        mkdirp("app/views/data");
        mkdirp("app/views/layout");
        mkdirp("app/views/pages");
        mkdirp("app/views/partials");
    },

    gruntfile: function () {
      this.copy("_Gruntfile.js", "Gruntfile.js");
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      )
    },

    bower: function () {

      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~2.1.4';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.3';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('.bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    editorConfig: function () {

      this.fs.copy(
        this.templatePath('.editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    scripts: function () {
      this.fs.copy(
        this.templatePath('scripts/_app.js'),
        this.destinationPath('app/scripts/app.js')
      );
    },

    styles: function () {
      this.fs.copyTpl(
        this.templatePath('styles/_main.scss'),
        this.destinationPath('app/styles/main.scss')
      )
    },

    html: function () {
        this.copy("styles/_main.scss", "app/styles/main.scss");
        this.copy("scripts/_app.js", "app/scripts/app.js");
        this.copy("scripts/_libs.js", "app/scripts/libs.js");
        this.copy("views/data/data.json", "app/views/data/data.json");
        this.copy("views/layout/_layout.twig", "app/views/layout/layout.twig");
        this.copy("views/pages/_article.twig", "app/views/pages/article.twig");
        this.copy("views/partials/_nav.twig", "app/views/partials/_nav.twig");
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  },

  end: function () {

    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('grunt wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }
    console.log('DONE ! Now you can run grunt serve from your project folder')
  }
});
