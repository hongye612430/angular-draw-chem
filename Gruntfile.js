module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
	concat: {
		build: {
			src: [
				"src/angular-draw-chem-app.js",
				"src/components/*/*.js",
				"!src/components/*/*-test.js"
			],
			dest: "src/components/angular-draw-chem.js"
		}
	},
	copy: {
		build: {
			files: [
				{ expand: true, cwd: "src/components/", src: "angular-draw-chem.js", dest: "dest/" }
			]
		}
	},
    uglify: {
		build: {
			files: {
				"dest/angular-draw-chem.min.js": "src/components/angular-draw-chem.js"
			}	
		}
    },
	clean: {
		build: ["src/components/angular-chemistry.js"]
	}
  });
  
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  
  grunt.registerTask("default", ["concat", "copy", "uglify", "clean"]);

};