module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			build : {
				files : [
							{
								src  : ['public/features/**/controllers/*.js'],
								dest : 'public/Features/controllers.min.js'
							},
							{
								src  : ['public/Features/**/Services/*.js'],
								dest : 'public/Features/services.min.js'
							},
							{
								src : ['public/Filters/*.js'],
								dest : 'public/Features/filters.min.js'
							},
							{
								src  : 'public/Directives/*.js',
								dest : 'public/Features/directives.min.js' 
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
				files : ['public/features/*.js'],
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