/*global module:false*/
module.exports = function(grunt) {
  /**
   JavaScript file include order
   Add new components to this array _after_ the components they inherit from
  */
  var includeOrder = {
    "cui-templates": [
      '{build}/CUI.Templates.js'
    ],
    "cui": [
      // Class system
      'Class.js',

      // Namespace
      'CUI.js',

      // Utilities
      'CUI.Util.js',

      // Persistence
      'CUI.Util.state.js',

      // Touch
      'CUI.Util.isTouch.js',

      // Components
      'components/CUI.Widget.js',
      'components/CUI.Modal.js',
      'components/CUI.Tabs.js',
      'components/CUI.Alert.js',
      'components/CUI.Rail.js',
      'components/CUI.Popover.js',
      'components/CUI.DropdownList.js',
      'components/CUI.Dropdown.js',
      'components/CUI.Filters.js',
      'components/CUI.Slider.js',
      'components/CUI.Datepicker.js',
      'components/CUI.Pulldown.js',
      'components/CUI.Sticky.js',
      'components/CUI.CardView.js',
      'components/CUI.PathBrowser.js',
      'components/CUI.Wizard.js',
      'components/CUI.FileUpload.js',
      'components/CUI.Toolbar.js'

    ],
    "cui-rte": [
      'components/rte/Theme.js',
      'components/rte/cui/ToolkitImpl.js',
      'components/rte/cui/ToolbarImpl.js',
      'components/rte/cui/ElementImpl.js',
      'components/rte/cui/ParaFormatterImpl.js',
      'components/rte/cui/StyleSelectorImpl.js',
      'components/rte/cui/CuiToolbarBuilder.js',
      'components/rte/cui/CmItemImpl.js',
      'components/rte/cui/CmSeparatorImpl.js',
      'components/rte/cui/CuiContextMenuBuilder.js',
      'components/rte/cui/CuiDialogManager.js',
      'components/rte/cui/CuiDialogHelper.js',

      'components/rte/stub/ToolkitImpl.js',
      'components/rte/stub/ToolbarImpl.js',
      'components/rte/stub/ElementImpl.js',
      'components/rte/stub/ParaFormatterImpl.js',
      'components/rte/stub/StyleSelectorImpl.js',
      'components/rte/stub/StubToolbarBuilder.js',
      'components/rte/stub/CmItemImpl.js',
      'components/rte/stub/CmSeparatorImpl.js',
      'components/rte/stub/StubContextMenuBuilder.js',
      'components/rte/stub/StubDialogManager.js',
      'components/rte/stub/StubDialogHelper.js',

      'components/CUI.RichText.js',

      'components/rte/init.js'
    ]
  };

  var packages = {
    "cui": [ "cui-templates", "cui"],
    "cui-rte": [ "cui-rte" ]
  };

  /**
    Build directories
    Any directories used by the build should be defined here
  */
  var dirs = {
    build: 'build',
    source: 'source',
    temp: 'temp',
    components: 'components',
    modules: 'node_modules',
    rte: "rte"
  };

  /**
    Get array of CUI includes in the correct order

    @param pkg      The package to build
    @param jsPath   Base path to prepend to each include
  */
  function getIncludes(pkg, jsPath) {
    var includes = [ ];
    var def = packages[pkg];
    def.forEach(function(_set) {
        includeOrder[_set].forEach(function(_file) {
          var pref = "{build}";
          var prefLen = pref.length;
          if ((_file.length >= prefLen) && (_file.substring(0, prefLen) === pref)) {
            includes.push(dirs.build + "/js/" + _file.substring(prefLen + 1));
          }
          includes.push(jsPath + _file);
        });
    });
    return includes;
  }

  // External tasks
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha');
  //grunt.loadNpmTasks('grunt-hub');

  // Read in package.json
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    // Meta and build configuration
    meta: {
      version: pkg.version,
      appName: pkg.name,
      appWebSite: pkg.repository.url
    },
    dirs: dirs,

    // Configuration
    jshint: {
      options: {
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        smarttabs: true,
        predef: [
          '$',            // jQuery
          'jQuery',       // jQuery
          'console',      // console.log...
          'Backbone',     // Backbone
          '_',            // Underscore
          'Handlebars',   // Handlebars
          'prettyPrint',  // google-code-prettify
          'CUI',          // CoralUI
          'Class',        // Class
          'moment'        // Moment.js
        ]
      },
      globals: {}
    },

    // Task definitions
    clean: {
      build: '<%= dirs.build %>',
      jsdoc: '<%= dirs.build %>/jsdoc',
      tests: [
        '<%= dirs.build %>/test/*.js',
        '<%= dirs.build %>/test/*.html'
      ]
    },

    copy: {
      guide: {
        src: '<%= dirs.source %>/guide/**',
        dest: '<%= dirs.build %>/'
      },
      images: {
        options: {
          basePath: 'images'
        },
        src: '<%= dirs.source %>/images/**',
        dest: '<%= dirs.build %>/images/'
      },
      fonts: {
        src: '<%= dirs.source %>/fonts/**',
        dest: '<%= dirs.build %>/fonts/'
      },
      less_bootstrap_tmp: {
        src: '<%= dirs.components %>/bootstrap/less/*',
        dest: '<%= dirs.temp %>/less/bootstrap/'
      },
      less_bootstrap_build: {
        src: '<%= dirs.components %>/bootstrap/less/*',
        dest: '<%= dirs.build %>/less/bootstrap/'
      },
      less_cui: {
        src: '<%= dirs.source %>/less/**',
        dest: '<%= dirs.build %>/less/'
      },
      libs: {
        files: {
          '<%= dirs.build %>/js/libs/jquery.js': '<%= dirs.components %>/jquery/index.js',
          '<%= dirs.build %>/js/libs/underscore.js': '<%= dirs.components %>/underscore/index.js',
          '<%= dirs.build %>/js/libs/handlebars.js': '<%= dirs.components %>/handlebars/index.js',
          '<%= dirs.build %>/js/libs/handlebars.full.js': '<%= dirs.components %>/handlebars-full/index.js'
        }
      },
      dependencies: {
        files: {
          '<%= dirs.build %>/js/libs/toe.js': '<%= dirs.source %>/js/plugins/toe.js',
          '<%= dirs.build %>/js/libs/jquery-fingerpointer.js': '<%= dirs.source %>/js/plugins/jquery-fingerpointer.js',
          '<%= dirs.build %>/js/libs/jquery-reflow.js': '<%= dirs.source %>/js/plugins/jquery-reflow.js',
          '<%= dirs.build %>/js/libs/jquery-gridlayout.js': '<%= dirs.source %>/js/plugins/jquery-gridlayout.js',
          '<%= dirs.build %>/js/libs/jquery-scrollable.js': '<%= dirs.source %>/js/plugins/jquery-scrollable.js',
          '<%= dirs.build %>/js/libs/moment.js': '<%= dirs.source %>/js/plugins/moment.js',
          '<%= dirs.build %>/js/libs/jquery-cookie.js': '<%= dirs.source %>/js/plugins/jquery-cookie.js'
        }
      },
      rte: {
        files: {
          '<%= dirs.build %>/js/libs/rte-core-jquery.js': '<%= dirs.rte %>/build/js/rte-core-jquery.js'
        }
      },
      prettyify: {
        src: '<%= dirs.components %>/bootstrap/docs/assets/js/google-code-prettify/*',
        dest: '<%= dirs.build %>/js/google-code-prettify/'
      },
      tests: {
        src: '<%= dirs.source %>/test/**',
        dest: '<%= dirs.build %>/test/'
      },
      test_libs: {
        files: {
          '<%= dirs.build %>/test/libs/mocha/': [
            '<%= dirs.modules %>/mocha/mocha.js',
            '<%= dirs.modules %>/mocha/mocha.css'
          ],
          '<%= dirs.build %>/test/libs/chai/': [
            '<%= dirs.modules %>/chai/chai.js'
          ],
          '<%= dirs.build %>/test/libs/chai-jquery/': [
            '<%= dirs.modules %>/chai-jquery/chai-jquery.js'
          ],
          '<%= dirs.build %>/test/libs/sinon/': [
            '<%= dirs.modules %>/sinon/lib/**'
          ],
          '<%= dirs.build %>/test/libs/sinon-chai/': [
            '<%= dirs.modules %>/sinon-chai/lib/sinon-chai.js'
          ]
        }
      }
    },

    mincss: {
      main: {
        files: {
          '<%= dirs.build %>/css/cui.min.css': '<%= dirs.build %>/css/cui.css',
          '<%= dirs.build %>/css/cui-wrapped.min.css': '<%= dirs.build %>/css/cui-wrapped.css'
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          wrapped: true,
          namespace: 'CUI.Templates',
          processName: function(path) {
            // Pull the filename out as the template name
            return path.split('/').pop().split('.').shift();
          }
        },
        files: {
          '<%= dirs.build %>/js/CUI.Templates.js': '<%= dirs.source %>/templates/*'
        }
      }
    },

    compress: {
      release: {
        options: {
          mode: 'zip'
        },
        files: {
          '<%= dirs.build %>/cui-<%= meta.version %>.zip': [
            '<%= dirs.build %>/css/**',
            '<%= dirs.build %>/fonts/**',
            '<%= dirs.build %>/images/**',
            '<%= dirs.build %>/js/**',
            '<%= dirs.build %>/less/**'
          ]
        }
      },
      full: {
        options: {
          mode: 'zip'
        },
        files: {
          '<%= dirs.build %>/cui-<%= meta.version %>-full.zip': [
            '<%= dirs.build %>/css/**',
            '<%= dirs.build %>/examples/**',
            '<%= dirs.build %>/fonts/**',
            '<%= dirs.build %>/images/**',
            '<%= dirs.build %>/js/**',
            '<%= dirs.build %>/jsdoc/**',
            '<%= dirs.build %>/less/**',
            '<%= dirs.build %>/test/**',
            '<%= dirs.build %>/index.html'
          ]
        }
      }
    },

    jsdoc3: {
      cui: {
        template: '<%= dirs.source %>/docTemplate',
        jsdoc: '<%= dirs.components %>/JSDoc/jsdoc',
        src: ['<%= dirs.source %>/js/*.js','<%= dirs.source %>/js/components/**'],
        dest: '<%= dirs.build %>/jsdoc'
      }
    },

    lint: {
      files: [
        'grunt.js',
        // exclude RTE for now ...
        '<%= dirs.source %>/js/*.js',
        '<%= dirs.source %>/js/components/*',
        '<%= dirs.source %>/guide/js/*'
      ]
    },

    concat: {
      cui: {
        src: getIncludes("cui", dirs.source+'/js/'),
        dest: '<%= dirs.build %>/js/CUI.js'
      },
      cui_cc: {
        src: getIncludes("cui", dirs.temp+'/js_instrumented/'),
        dest: '<%= dirs.temp %>/js_instrumented/CUI_cc.js'
      },
      cui_rte: {
        src: getIncludes("cui-rte", dirs.source+'/js/'),
        dest: '<%= dirs.build %>/js/cui-rte.js'
      }
    },

    /*
    hub: {
      rte: {
        src: [ '<%= dirs.rte%>/grunt.js'],
        tasks: [ 'full' ]
      }
    },
    */
    subgrunt: {
      rte: {
        subdir: './rte/',
        args: ['full']
      }
    },

    min: {
      cui: {
        src: ['<config:concat.cui.dest>'],
        dest: '<%= dirs.build %>/js/CUI.min.js'
      },
      cui_rte: {
        src: ['<config:concat.cui_rte.dest>'],
        dest: '<%= dirs.build %>/js/cui-rte.min.js'
      }
      // TBD: minify individual JS files?
    },

    less: {
      "cui-wrapped": {
        options: {
          paths: [  // grunt-contrib-less doesn't support template tags, use dirs instead
            dirs.build+'/less/',
            dirs.temp+'/less/'
          ]
        },
        files: {
          '<%= dirs.build %>/css/cui-wrapped.css': '<%= dirs.source %>/less/cui-wrapped.less'
        }
      },
      "cui": {
        options: {
          paths: [  // grunt-contrib-less doesn't support template tags, use dirs instead
            dirs.build+'/less/',
            dirs.temp+'/less/'
          ]
        },
        files: {
          '<%= dirs.build %>/css/cui.css': '<%= dirs.source %>/less/cui.less'
        }
      },
      "guide": {
        options: {
          paths: [  // grunt-contrib-less doesn't support template tags, use dirs instead
            dirs.source+'/less/', // must hardcode paths here, grunt-contrib-less doesn't support template tags
            dirs.temp+'/less/' // must hardcode paths here, grunt-contrib-less doesn't support template tags
          ]
        },
        files: {
          '<%= dirs.build %>/css/guide.css': '<%= dirs.source %>/guide/less/guide.less'
        }
      },
      "wizard": {
        options: {
          paths: [  // grunt-contrib-less doesn't support template tags, use dirs instead
            dirs.source+'/less/', // must hardcode paths here, grunt-contrib-less doesn't support template tags
            dirs.temp+'/less/' // must hardcode paths here, grunt-contrib-less doesn't support template tags
          ]
        },
        files: {
          '<%= dirs.build %>/css/wizard.css': '<%= dirs.source %>/guide/less/wizard.less'
        }
      },
      "aemwelcome": {
        options: {
          paths: [  // grunt-contrib-less doesn't support template tags, use dirs instead
            dirs.source+'/less/', // must hardcode paths here, grunt-contrib-less doesn't support template tags
            dirs.temp+'/less/' // must hardcode paths here, grunt-contrib-less doesn't support template tags
          ]
        },
        files: {
          '<%= dirs.build %>/css/aem-welcome.css': '<%= dirs.source %>/guide/less/aem-welcome.less'
        }
      }
    },

    mvn: {
      build: {}
    },

    mocha: {
      cui: {
        run: true,

        src: [
          '<%= dirs.build %>/test/index.html'
        ]
      }
    },

    coverage: {},

    font: {
      options: {
        src: '<%= dirs.source %>/images/icons/',
        dest_css: '<%= dirs.source %>/less/base/',
        dest_font: '<%= dirs.source %>/fonts/',
        dest_css_name: 'icons_mono.less',
        // Should write to build folder in the future: // dest_css_name: '<%= dirs.build %>/less/base/icons_mono.less',
        dest_font_name: 'AdobeIcons',
        prefix: 'icon-'
      }
    },


    icons: {
      all: {
        src: [
          '<%= dirs.source %>/images/icons_color/*.svg'
        ],
        dest: '<%= dirs.build %>/less/base/icons_color.less',
        prefix: 'icon-'
      }
    },

    iconbrowser: {
      all: {
        src: '<%= dirs.source %>/images/icons/**/*',
        dest: '<%= dirs.build %>/examples/assets/iconbrowser.json'
      }
    },

    // Watch operations
    watch: {
      copy_guide: {
        files: '<%= dirs.source %>/guide/**',
        tasks: 'copy:guide'
      },

      lint_js: {
        files: '<config:lint.files>',
        tasks: 'lint'
      },

      concat_min_js: {
        files: [
          '<%= dirs.source %>/js/**'
        ],
        tasks: 'concat:cui min:cui'
      },

      compile_less_min_css: {
        files: '<%= dirs.source %>/less/**',
        tasks: 'copy:less_cui less:cui mincss'
      },

      compile_guide_less: {
        files: '<%= dirs.source %>/guide/less/guide.less',
        tasks: 'less:guide'
      },
      compile_wizard_less: {
        files: '<%= dirs.source %>/guide/less/wizard.less',
        tasks: 'less:wizard'
      },
      compile_aemwelcome_less: {
        files: '<%= dirs.source %>/guide/less/aem-welcome.less',
        tasks: 'less:aemwelcome'
      },

      compile_handlebars: {
        files: '<%= dirs.source %>/templates/*',
        tasks: 'handlebars concat:cui min:cui'
      },

      copy_tests: {
        files: '<%= dirs.source %>/test/**',
        tasks: 'clean:tests copy:tests'
      },

      copy_plugins: {
          files: '<%= dirs.source %>/js/plugins/**',
          tasks: "copy:libs"
      },

      run_tests: {
        files: [
          '<%= dirs.source %>/js/**',
          '<%= dirs.build %>/js/CUI.Templates.js',
          '<%= dirs.source %>/test/**'
        ],
        tasks: 'mocha'
      },

      // Note that this is only a "stub" implementation for watching changes in RTE. To get
      // the expected behavior, use the commented definition below (and see the notes there
      // on how to handle errors)
      rte: {
        files: ['<%= dirs.rte %>/grunt.js'],
        tasks: 'subgrunt:rte copy:rte'
      }

      /*

      Full RTE watch implementation - but use with caution: due to OS-specific limits,
      ulimit might need to be set explicitly before, otherwise NodeJS may choke.

      ulimit -n 1000 worked for me

      rte: {
        files: ["<%= dirs.rte %>/grunt.js", "<%= dirs.rte %>/<%= dirs.source %>/" + "**"],
        tasks: 'subgrunt:rte copy:rte'
      }
      */

    }
  });

  // Partial build for development
  grunt.registerTask('partial', 'lint font copy handlebars icons iconbrowser concat:cui min:cui less mincss mocha');

  // Build and copy RTE
  grunt.registerTask("rte", 'subgrunt:rte copy:rte');

  // Full build with docs and compressed file
  grunt.registerTask('full-build', 'lint rte font copy icons iconbrowser handlebars concat:cui concat:cui_rte min less mincss mocha jsdoc');

  // Full build with docs and compressed file
  grunt.registerTask('full', 'clean full-build');

  // Release build
  // TODO: add maven?
  grunt.registerTask('release', 'clean full-build coverage compress');

  // Rename mvn task so we can override it
  grunt.task.renameTask('mvn', 'mvn-install');

  // Almost full build, just the stuff needed for Granite install
  grunt.registerTask('mvn-build', 'clean lint copy:images copy:fonts copy:dependencies copy:less_bootstrap_tmp copy:less_bootstrap_build copy:less_cui font icons iconbrowser handlebars concat:cui less:cui');


  // Custom build for maven
  grunt.registerTask('mvn', 'mvn-build mvn-install');

  // Rename mvn-deploy task so we can override it
  grunt.task.renameTask('mvn-deploy', 'mvn-nexus-deploy');

  // mvn deploy task for jenkins
  grunt.registerTask('mvn-deploy', 'mvn-build mvn-nexus-deploy');

  // Rename watch task so we can override it
  grunt.task.renameTask('watch', 'watch-start');

  // Redefine watch to build partial first
  grunt.registerTask('watch', 'partial watch-start');

  // Rename jsdoc task so we can override it
  grunt.task.renameTask('jsdoc', 'jsdoc3');

  // Redefine jsdoc task to clean first
  grunt.registerTask('jsdoc', 'clean:jsdoc jsdoc3');

  // Default task
  grunt.registerTask('default', 'partial');
};
