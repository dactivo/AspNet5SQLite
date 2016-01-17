module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: ".bower_components",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'tmp/default_theme.css': 'app/content/default_theme.scss'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            dist: {
                files: {
                    'wwwroot/assets/css/default_theme.min.css': [".bower_components/bootstrap/css/bootstrap.min.css","tmp/default_theme.css"]
                }
            }
        },
        uglify: {
            my_target: {
                files: { 'wwwroot/assets/js/app.js': ['app/app.js', 'app/**/**/*.js', 'app/**/*.js'] }
            },
            platform:{
                files:{'wwwroot/assets/js/platform.js':['.bower_components/jquery/js/jquery.min.js','.bower_components/bootstrap/js/bootstrap.min.js','.bower_components/angular/angular.min.js','.bower_components/angular-ui-router/angular-ui-router.min.js']}
            }
        },
        copy: {
  main: {
    files: [
      // includes files within path
      {expand: true, flatten: true, src: ['.bower_components/bootstrap/fonts/*'], dest: 'wwwroot/assets/fonts', filter: 'isFile'},

    ]}},
    
    concat: {
            options: {
                stripBanners: true
            },
            my_target : {
                src : [
                 'app/app.js',
                 'app/**/*.js'
                ],
                dest: 'wwwroot/assets/js/app.js'
            }
            ,
            platform: {
                src:[
                    '.bower_components/angular/angular.js','.bower_components/angular-ui-router/angular-ui-router.js'
                ],
                dest:'wwwroot/assets/js/platform.js'
            },
            css:{
                src:[".bower_components/bootstrap/css/bootstrap.min.css","tmp/default_theme.css"],
                dest:'wwwroot/assets/css/default_theme.min.css'
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['uglify']
            },
            appFolderCss: {
                files: ['app/content/**/*.scss'],
                tasks: ['sass', 'cssmin']
            }
        }
    });

    grunt.registerTask("bowertask", ["bower:install"]);
    grunt.registerTask('default', ['sass', 'cssmin', 'uglify:my_target','uglify:platform','copy:main', 'watch']);
    grunt.registerTask("dev",['sass', 'concat:css', 'concat:my_target','concat:platform','copy:main', 'watch']);
};