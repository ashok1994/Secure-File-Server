module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			build : {
				files : []
			}
		},
		concat: {
				dist:{
					src  : [],
					dest : '' 
				}
		},

		watch : {
			scripts : {
				files : [''],
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
