/*global module:false */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        testacular: {
            unit: {
                configFile: 'src/test/testacular.conf.js'
            },
            continuous: {
                configFile: 'src/test/testacular.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        jshint: {
            // only check BrowserMap files and Gruntfile.js
            files: {
                src: [
                'Gruntfile.js',
                'src/main/js/*.js'
                ]
            },
            options: {
                browser: true,
                curly: true,
                forin: true,
                camelcase: true,
                quotmark: true,
                undef: true,
                unused: true,
                trailing: true,
                maxlen: 140,
                multistr: true
            }
        },
        copy: {
            browsermap: {
                files: [
                    {src: ['src/main/js/*.js'], dest: 'target/libs/browsermap/', expand: true, flatten: true},
                    {cwd: 'src/main/lib/', src: ['**'], dest: 'target/libs/externals/', expand: true}
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: {
                    except: ['BrowserMap', 'BrowserMapUtil', 'Modernizr']
                }
            },
            target: {
                files: {
                    'target/libs/min/browsermap.min.js': [
                        'target/libs/browsermap/**/*.js',
                        'target/libs/externals/**/*.js'
                    ]
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/main/js/*.js', 'README.md'],
                dest: 'target/doc'
            }
        },
        compress: {
            browsermap: {
                options: {
                    archive: 'target/browsermap-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    {src: ['AUTHORS', 'LICENSE', 'README.md'], dest: '.'},
                    {cwd: 'target/doc', src: ['**'], dest: 'doc/', expand: true},
                    {cwd: 'target/libs/', src: ['browsermap/**'], dest: 'libs/', expand: true},
                    {cwd: 'target/libs/', src: ['externals/**'], dest: 'libs/', expand: true},
                    {cwd: 'target/libs/min/', src: ['*.js'], dest: 'libs/', expand: true}
                ]
            }
        },
        'qunit-cov': {
            test: {
                minimum: 0.4,
                srcDir: 'src/main/js',
                depDirs: ['src/test'],
                outDir: 'target/coverage',
                testFiles: ['src/test/resources/*.html']
            }
        },
        clean: ['target/']
    });

    grunt.loadNpmTasks('gruntacular');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-qunit-cov');

    grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('coverage', ['qunit-cov']);
    grunt.registerTask('test', ['jshint', 'testacular:continuous', 'coverage']);
    grunt.registerTask('package', ['clean', 'test', 'copy', 'minify', 'jsdoc', 'compress']);
};
