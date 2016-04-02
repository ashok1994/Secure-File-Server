module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			build : {
				files : [
							{
								src  : ['public/features/**/controllers/*.js', 'public/common/*.js'],
								dest : 'public/features/controllers.min.js'
							},
							{
								src  : ['public/features/**/Services/*.js'],
								dest : 'public/features/services.min.js'
							},
							{
								src : ['public/filters/*.js'],
								dest : 'public/features/filters.min.js'
							},
							{
								src  : 'public/directives/*.js',
								dest : 'public/features/directives.min.js' 
							}
						]
			}
		},
		concat: {
				dist:{
					src  : ['public/features/*.min.js'],
					dest : 'public/js-bundle.min.js' 
				}
		},

		watch : {
			scripts : {
				files : ['public/features/*.js', 'public/common/*.js'],
				tasks : ['uglify','concat'],
				options : {
					spawn : false,
				}
			}
		
		}
	});
	//load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');


	//perform the task
	grunt.registerTask('default', ['uglify', 'concat']);
}
