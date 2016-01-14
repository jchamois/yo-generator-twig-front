
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
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
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      css: {
        files: ['<%= yeoman.app %>/<%= yeoman.styles %>/*.css']
      },
      twig: {
        files: ['<%= yeoman.app %>/<%= yeoman.views %>/**/*.twig'],
        tasks: ['twigRender']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: 'http://localhost:9000/<%= yeoman.preview %>/<%= yeoman.pages %>/article.html',
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/<%= yeoman.styles %>')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },
    browserSync: {
      options: {
        notify: false,
        background: true,
        reloadDebounce: 2000
      },

      livereload: {
        options: {
          startPath: "/<%= yeoman.preview %>/<%= yeoman.pages %>/article.html",
          files: [
            '<%= yeoman.app %>/<%= yeoman.views %>/**/*.twig',
            '<%= yeoman.app %>/<%= yeoman.preview %>/<%= yeoman.pages %>/*.html',
            '<%= yeoman.app %>/<%= yeoman.styles %>/*.{css,scss,sass}',
            '.tmp/<%= yeoman.styles %>/*.{css,scss,sass}',
            '<%= yeoman.app %>/<%= yeoman.assets %>/**',
            '<%= yeoman.app %>/<%= yeoman.scripts %>/*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', appConfig.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%= yeoman.dist %>'
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
          '<%= yeoman.app %>/<%= yeoman.scripts %>/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Automatically inject Bower components into the app
    wiredep: {
      build: {
        src: ['<%= yeoman.app %>/<%= yeoman.views %>/<%= yeoman.layout %>/layout.twig'],
        ignorePath:  '../../../'
      },
      serve: {
        src: ['<%= yeoman.app %>/<%= yeoman.views %>/<%= yeoman.layout %>/layout.twig'],
        ignorePath:  /\.\.\//,
          onError: function(err) {
          if(err.code == 'BOWER_COMPONENTS_MISSING'){
            console.log(err.code)
            grunt.option("force",true);
          }
        }
      },
      sass: {
        src: ['<%= yeoman.app %>/<%= yeoman.styles %>/{,*/}*.{scss,sass}'],
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
          cwd: '<%= yeoman.app %>/styles',
          src: ['*.{scss,sass,css}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
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
          '<%= yeoman.dist %>/<%= yeoman.scripts %>/{,*/}*.js',
          '<%= yeoman.dist %>/<%= yeoman.styles %>/{,*/}*.css',
          '<%= yeoman.dist %>/<%= yeoman.styles %>/fonts/*'
        ]
      },
      img:{
         src: [
          //'<%= yeoman.dist %>/<%= yeoman.assets %>/<%= yeoman.images %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/<%= yeoman.views %>/<%= yeoman.layout %>/*.twig',
      options: {
        dest: '<%= yeoman.dist %>',
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
      html: ['<%= yeoman.dist %>/*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.styles %>/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
         // '<%= yeoman.dist %>/<%= yeoman.assets %>/<%= yeoman.images %>',
          '<%= yeoman.dist %>/<%= yeoman.styles %>'
        ]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/<%= yeoman.assets %>/<%= yeoman.images %>',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/<%= yeoman.assets %>/<%= yeoman.images %>'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/<%= yeoman.assets %>/<%= yeoman.images %>',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/<%= yeoman.assets %>/<%= yeoman.images %>'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          flatten: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['<%= yeoman.preview %>/<%= yeoman.pages %>/*.html']
        },{
          expand: true,
          flatten: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['<%= yeoman.preview %>/<%= yeoman.pages %>/*.html']
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '<%= yeoman.assets %>/**',
            '<%= yeoman.styles %>/fonts/{,*/}*.*'
          ]
        }
         ]
      },
       styles: {
        expand: true,
        //cwd: '<%= yeoman.app %>',
        dest: '.tmp/',
        src: [
          'app/styles/*.css',
          'bower_components/**/*.css'
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process

    concurrent: {
      server: ['sass:server'],
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
              data: '<%= yeoman.app %>/<%= yeoman.views %>/data/data.json',
              expand: true,
              cwd: '<%= yeoman.app %>/<%= yeoman.views %>',
              src: ['<%= yeoman.pages %>/*.twig'], // Match twig templates but not partials
              dest: '<%= yeoman.app %>/<%= yeoman.preview %>',
              ext: '.html'   // index.twig + datafile.json => index.html
            }
          ]
        },
      },

     'string-replace': {
        img: {
          files: {
            '<%= yeoman.dist %>/': '<%= yeoman.dist %>/*.html'
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
    'twigRender',
    'copy:styles',
    'copy:dist',
    'imagemin',
    'svgmin',
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
