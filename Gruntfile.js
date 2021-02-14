module.exports = function(grunt) {

    var mozjpeg = require('imagemin-mozjpeg');
    var Advpng = require('imagemin-advpng');

	grunt.initConfig({

    	/**
    	 * Image Minifier
    	 */
    	imagemin: {
    	    png: {
                options: {
                  optimizationLevel: 7,
                  use: [Advpng()]
            },
            files: [{
                    expand: true,                         // Enable dynamic expansion
                    cwd: 'public/css/imgs/no-compress',  // path images source
                    src: ['*.png'],             // patterns to match
                    dest: 'public/css/imgs'               // path images destination
                }]
            },
            jpg: {
                options: {
                      optimizationLevel: 3,
                      progressive: true,
                      use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'public/css/imgs/no-compress',
                    src: ['*.jpg'],
                    dest: 'public/css/imgs'
                }]
            },
            images: {
                options: {
                      optimizationLevel: 3,
                      progressive: true,
                      use: [mozjpeg(), Advpng()]
                },
                files: [{
                    expand: true,
                    cwd: 'public/imgs/no-compress',
                    src: ['*.jpg', '*.png'],
                    dest: 'public/imgs/'
                }]
            }
        },

	   /**
	    * css minifier
	    */
        cssmin: {
    	    target: {
        	    files: {
                    'public/css/font-awesome.min.css': ['public/css/font-awesome.css'],
                    'public/css/front.theme.min.css': [
                        'public/css/bootstrap.min.css',
                        'public/css/font-awesome.min.css',
                        'public/css/front.theme.css',
                        'public/css/jquery.modal.css'
                    ]
                },
            }
    	},

        /**
         * Watch files
         */
        watch: {
            scripts: {
                files: [
                    'css/dev/main.scss',
                ],
                tasks: [
                    'sass'
                ],
                options: {
                    spawn: false,
                },
            }
        },

        /**
         * SASS
         */
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/main.css': 'css/dev/main.scss'
                }
            }
        },

        /**
         * Uglify (compress and concat js files)
         */
        uglify: {
            my_target: {
                files: {
                    'public/js/main.min.js': [
                        'public/js/jquery.modal.js',
                        'public/js/main.js',
                        'public/js/yurin.paralax.js'
                    ],
                    'public/js/main.blog.min.js': ['public/js/main.blog.js'],
                    'public/js/admin.gallery.min.js': ['public/js/admin.gallery.js']
                }
            }
        }
    });

    // Modules
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // taches
    grunt.registerTask('default', ['cssmin']);
    grunt.registerTask('build', ['sass', 'cssmin', 'uglify']);
}
