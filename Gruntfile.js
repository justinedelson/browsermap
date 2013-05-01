/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
                        'target/libs/browsermap/bmaputil.js',
                        'target/libs/browsermap/bmap.js',
                        'target/libs/externals/modernizr/modernizr.custom.js',
                        'target/libs/externals/matchMedia/matchMedia.js',
                        'target/libs/browsermap/probes.js',
                        'target/libs/browsermap/devicegroups.js'
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
