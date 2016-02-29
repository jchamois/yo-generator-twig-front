'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
   require('jit-grunt')(grunt, {
	useminPrepare: 'grunt-usemin',
	cdnify: 'grunt-google-cdn'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var config = {
	app: 'app',
	dist: 'dist',
	views : 'views',
	preview: 'preview',
	partials: 'partials',
	pages: 'pages',
	layout: 'layout',
	scripts : 'scripts',
	styles : 'styles',
	assets : 'assets',
	images : 'images',
	videos : 'videos'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

	// Project settings
	config: config,

	// Watches files for changes and runs tasks based on the changed files
	watch: {
	  js: {
		files: ['app/scripts/{,*/}*.js'],
		tasks: ['newer:jshint:all']
	  },<% if (includeSass) { %>
	  sass: {
		files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
		tasks: ['sass', 'postcss']
		},
		<% } %>
	  styles: {
		files: ['app/styles/{,*/}*.css'],
		tasks: ['newer:copy:styles', 'postcss']
	  },
	  twig: {
		files: ['app/views/**/*.twig'],
		tasks: ['twigRender']
	  },
	  gruntfile: {
		files: ['Gruntfile.js']
	  }
	},

	// The actual grunt server settings

	browserSync: {
	  options: {
		notify: false,
		background: true,
		reloadDebounce: 2000
	  },

	  livereload: {
		options: {
		  startPath: "/preview/pages/article.html",
		  files: [
			'app/views/**/*.twig',
			'app/preview/pages/*.html',
			'app/styles/*.{css,scss,sass}',
			'.tmp/styles/*.{css,scss,sass}',
			'app/assets/**',
			'app/scripts/*.js'
		  ],
		  port: 9000,
		  server: {
			baseDir: ['.tmp', config.app],
			routes: {
			  '/bower_components': './bower_components'
			}
		  }
		}
	  },
	  dist: {
		options: {
		  background: false,
		  server: 'dist'
		}
	  }
	},
	// Make sure code styles are up to par and there are no obvious mistakes
	jshint: {
	  options: {
		jshintrc: '.jshintrc',
		reporter: require('jshint-stylish')
	  },
	  all: {
		src: [
		  'Gruntfile.js',
		  'app/scripts/{,*/}*.js'
		]
	  }
	},

	// Empties folders to start fresh
	clean: {
	  dist: {
  		options : {
	  		force:true
	  	},
		files: [{
		  dot: true,
		  src: [
			'.tmp',
			'dist/{,*/}*',
			'!dist/.git{,*/}*'
		  ]
		}]
	  },
	  server: {
	 	 options : {
	  		force:true
	  	},
	  	files: [{
		  dot: true,
		  src: [
			'.tmp'

		  ]
		}]
	 }
	},

	// Automatically inject Bower components into the app
	wiredep: {
	  build: {
		src: ['app/views/layout/layout.twig'],
		ignorePath:  '../../../'
	  },
	  serve: {
		src: ['app/views/layout/layout.twig'],
		ignorePath:  /\.\.\//,
		  onError: function(err) {
		  if(err.code == 'BOWER_COMPONENTS_MISSING'){
			console.log(err.code)
			grunt.option("force",true);
		  }
		}
	  },
	  sass: {
		src: ['app/styles/{,*/}*.{scss,sass}'],
		ignorePath: /(\.\.\/){1,2}bower_components\//
	  }
	},

	// Compiles Sass to CSS and generates necessary files if requested

	sass: {
	  options: {
		sourceMap: true,
		sourceMapEmbed: true,
		sourceMapContents: true,
		includePaths: ['bower_components']
	  },
	  dist: {
		files: [{
		  expand: true,
		  cwd: 'app/styles',
		  src: ['*.{scss,sass,css}'],
		  dest: '.tmp/styles',
		  ext: '.css'
		}]
	  },
	  server: {
		files: [{
		  expand: true,
		  cwd: 'app/styles',
		  src: ['*.{scss,sass,css}'],
		  dest: '.tmp/styles',
		  ext: '.css'
		}]
	  }
	},

	// Renames files for browser caching purposes
	filerev: {
	  dist: {
		src: [
		  'dist/scripts/{,*/}*.js',
		  'dist/styles/{,*/}*.css',
		  'dist/styles/fonts/*'
		]
	  },
	  img:{
		 src: [
		  //'dist/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
		]
	  }
	},

	// Reads HTML for usemin blocks to enable smart builds that automatically
	// concat, minify and revision files. Creates configurations in memory so
	// additional tasks can operate on them
	useminPrepare: {
	  html: 'app/views/layout/*.twig',
	  options: {
		dest: 'dist',
		flow: {
		  html: {
			steps: {
			  js: ['concat', 'uglifyjs'],
			  css: ['cssmin']
			},
			post: {}
		  }
		}
	  }
	},

	// Performs rewrites based on filerev and the useminPrepare configuration
	usemin: {
	  html: ['dist/*.html'],
	  css: ['dist/styles/{,*/}*.css'],
	  options: {
		assetsDirs: [
		  'dist',
		 // 'dist/assets/images',
		  'dist/styles'
		]
	  }
	},

	imagemin: {
	  dist: {
		files: [{
		  expand: true,
		  cwd: 'app/assets/images',
		  src: '{,*/}*.{png,jpg,jpeg,gif}',
		  dest: 'dist/assets/images'
		}]
	  }
	},

	svgmin: {
	  dist: {
		files: [{
		  expand: true,
		  cwd: 'app/assets/images',
		  src: '{,*/}*.svg',
		  dest: 'dist/assets/images'
		}]
	  }
	},

	// Replace Google CDN references
	cdnify: {
	  dist: {
		html: ['dist/*.html']
	  }
	},

	// Copies remaining files to places other tasks can use
	copy: {
	  dist: {
		files: [{
		  expand: true,
		  flatten: true,
		  dot: true,
		  cwd: 'app',
		  dest: 'dist',
		  src: ['preview/pages/*.html']
		  },{
		  expand: true,
		  flatten: true,
		  dot: true,
		  cwd: 'app',
		  dest: 'dist',
		  src: ['preview/pages/*.html']
		},
		{
		  expand: true,
		  dot: true,
		  cwd: 'app',
		  dest: 'dist',
		  src: [
			'*.{ico,png,txt}',
			'.htaccess',
			'*.html',
			'assets/**',
			'styles/fonts/{,*/}*.*',
			'bower_components/**/*.css']
		}
		]
	  },
	   styles: {
		expand: true,
		cwd: 'app/styles',
		dest: '.tmp/styles/',
		src: [
		  '{,*/}*.css',
		  'bower_components/**/*.css'
		]
	  }
	},

	postcss: {
	  options: {
		map: true,
		processors: [
		  // Add vendor prefixed styles
		  require('autoprefixer')({
			browsers: ['> 1%', 'last 10 versions', 'Firefox ESR']
		  })
		]
	  },
	  dist: {
		files: [{
		  expand: true,
		  cwd: '.tmp/styles/',
		  src: '{,*/}*.css',
		  dest: '.tmp/styles/'
		}]
	  }
	},

	// Run some tasks in parallel to speed up the build process

	concurrent: {
	  server: ['sass'],
	  dist: [
		'sass:dist',
		'imagemin',
		'svgmin'
	  ]
	},

	twigRender: {
		your_target: {
		  files : [
			{
			  data: 'app/views/data/data.json',
			  expand: true,
			  cwd: 'app/views',
			  src: ['pages/*.twig'], // Match twig templates but not partials
			  dest: 'app/preview',
			  ext: '.html'   // index.twig + datafile.json => index.html
			}
		  ]
		},
	  },

	 'string-replace': {
		img: {
		  files: {
			'dist/': 'dist/*.html'
		  },
		  options: {
			replacements: [{
			  pattern: /\/assets/gi,
			  replacement: 'assets'
			}]
		  }
		}
	  }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
	if (target === 'dist') {
	  //return grunt.task.run(['build', 'connect:dist:keepalive']);
	}

	grunt.task.run([
	  'clean:server',
	  'wiredep:serve',
	  'concurrent:server',
	  'twigRender',
	  'browserSync:livereload',
	  'watch'
	]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
	grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
	grunt.task.run(['serve:' + target]);
  });


  grunt.registerTask('build', [
	'clean:dist',
	'wiredep:build',
	'concurrent:dist',
	'twigRender',
	'copy:dist',
	'copy:styles',
	'useminPrepare',
	'cdnify',
	'cssmin',
	'concat',
	'uglify',
	'filerev',
	'usemin',
	'string-replace'
  ]);

  grunt.registerTask('default', [
	'build'
  ]);
};

