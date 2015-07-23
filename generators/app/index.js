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
			name: 'appName',
			message: 'Un nom pour le projet ?',
			default : 'projet'
		},{

			type: 'checkbox',
			name: 'features',
			message: 'Des outils supplémentaires à inclure ?',
			choices: [{
				name: 'Modernizr',
				value: 'includeModernizr',
				checked: false
			},
			{
				name: 'Sass',
				value: 'includeSass',
				checked: false
			}]
		},{
			type: 'confirm',
			name: 'includeJQuery',
			message: 'Jquery 2 ça peut servir ?',
			default: true,
			when: function (answers) {
				return answers.features
			}
		},{
			type: 'confirm',
			name: 'includeAtomik',
			message: 'Atomik css ? ou pas ?',
			default: false,
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
			this.includeSass = hasFeature('includeSass');;

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

			this.fs.copyTpl(
				this.templatePath('_Gruntfile.js'),
				this.destinationPath('Gruntfile.js'),{
					includeSass: this.includeSass
				})
		},

		packageJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json')
				)
		},

		bower: function () {

			var bowerJson = {
				name: _s.slugify(this.appName),
				private: true,
				dependencies: {}
			};

			if (this.includeJQuery) {
				bowerJson.dependencies['jquery'] = '~2.1.4';
			}

			if(this.includeModernizr) {
				bowerJson.dependencies['modernizr'] = '~2.8.3';
			}

			if (this.includeAtomik) {
				bowerJson.dependencies['atomik-css'] = '~1.0.0';
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

		gitConfig: function () {
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('.gitignore')
				);
		},

		jshintConfig: function () {
			this.fs.copy(
				this.templatePath('_jshintrc'),
				this.destinationPath('.jshintrc')
			);
		},

		scripts: function () {
			this.copy('scripts/_app.js','app/scripts/app.js')
			this.copy('scripts/_utils.js','app/scripts/utils.js')
			this.copy('scripts/_barker.js','app/scripts/barker.js')
		},
		data: function(){
			this.copy("views/data/data.json", "app/views/data/data.json");
		},

		html: function(){

			var dir = (this.includeAtomik) ? 'atomik' : 'std';

			this.fs.copyTpl(
				this.templatePath('views/'+dir+'/layout/_layout.twig'),
				this.destinationPath('app/views/layout/layout.twig'),{
					appName: this.appName,
					includeModernizr: this.includeModernizr,
					includeAtomik: this.includeAtomik,
				});
			this.copy("views/"+dir+"/partials/_nav.twig", "app/views/partials/_nav.twig");
			this.copy("views/"+dir+"/partials/_header.twig", "app/views/partials/_header.twig");
			this.copy("views/"+dir+"/partials/_main.twig", "app/views/partials/_main.twig");
			this.copy("views/"+dir+"/partials/_footer.twig", "app/views/partials/_footer.twig");
			this.copy("views/"+dir+"/pages/_home.twig", "app/views/pages/home.twig");

		},

		css: function(){

			var ext = (this.includeSass) ? 'scss' : 'css';

			if (this.includeAtomik) {
				this.remote('jchamois', 'atomik-css', 'master', function(err, remote) {
					remote.copy("app/src/css/reset.css", "app/styles/reset."+ext);
					remote.copy("app/src/css/grid-module.css", "app/styles/grid-module."+ext);
					remote.copy("app/src/css/atomic-core.css", "app/styles/atomic-core."+ext);
					remote.copy("app/src/css/atomic-custom.css", "app/styles/atomic-custom."+ext);
					remote.copy("app/src/css/author.css", "app/styles/author."+ext);
					remote.copy("app/src/css/mq.css", "app/styles/mq."+ext);
				}, true);

			}else{
				this.copy("styles/_main.css", "app/styles/main."+ext);
			}
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

		var endCredit = '\nDONE ! ' +
		chalk.yellow.bold('If there is an error with npm, run "sudo npm install"') +
		'\nthen run '+ chalk.yellow.bold('grunt serve') +' to bootstrap the project';

		if (this.options['skip-install']) {
			this.log(howToInstall);
			return;
		}
		this.log(endCredit)
	}
});
