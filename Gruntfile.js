module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			dist: {
				files: {
					'public/css/app.css': 'public/sass/app.scss'
				}
			}
		},
		watch: {
			dist: {
				files: 'public/sass/*.scss',
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
}