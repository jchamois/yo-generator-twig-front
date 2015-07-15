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
    console.log('askFor');
    var done = this.async();

    if (!this.options['skip-welcome-message']) {

      this.log(yosay('Alors Ca compile du ' + chalk.red(' Twig-front ') + '?'));

    }

    var prompts = [{
        name: 'appName',
        message: 'What is your app\'s name ?'
      },{

      type: 'checkbox',
      name: 'features',
      message: 'Un petit modernizr ?',
      choices: [{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    },{
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Jquery ça peut servir ?',
      default: true,
      when: function (answers) {
        return answers.features
      }
    },{
      type: 'confirm',
      name: 'includeAtomik',
      message: 'Atomik css ? ou pas ?',
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

      this.appName = answers.appName;
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeJQuery = answers.includeJQuery;
      this.includeAtomik = answers.includeAtomik;

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

      if(this.includeModernizr) {
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


    jshintConfig: function () {
      this.fs.copy(
        this.templatePath('_jshintrc'),
        this.destinationPath('.jshintrc')
      );
    },

    scripts: function () {
      this.fs.copy(
        this.templatePath('scripts/_app.js'),
        this.destinationPath('app/scripts/app.js')
      );
    },

    layout: function(){

        this.fs.copyTpl(
          this.templatePath('views/layout/_layout.twig'),
          this.destinationPath('app/views/layout/layout.twig'),
          {
            appName: this.appName,
            includeModernizr: this.includeModernizr,
            includeAtomik: this.includeAtomik,
          }
        );
    },


    css: function(){

       if (this.includeAtomik) {
         this.remote('jchamois', 'atomik-css', 'master', function(err, remote) {
            remote.copy("app/src/css/reset.css", "app/styles/reset.scss");
            remote.copy("app/src/css/atomic-core.css", "app/styles/atomic-core.scss");
            remote.copy("app/src/css/atomic-custom.css", "app/styles/atomic-custom.scss");
            remote.copy("app/src/css/author.css", "app/styles/author.scss");
            remote.copy("app/src/css/mq.css", "app/styles/mq.scss");
        }, true);

       }else{
          this.copy("styles/_main.scss", "app/styles/main.scss");
       }


    },

    mainFiles: function () {
        this.copy("scripts/_app.js", "app/scripts/app.js");
        this.copy("scripts/_libs.js", "app/scripts/libs.js");
        this.copy("views/data/data.json", "app/views/data/data.json");
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
