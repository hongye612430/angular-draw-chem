module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
	watch: {
		buildJs: {
		  files: ["src/angular-draw-chem-app.js", "src/components/*/*.js", "!src/components/*/*-test.js"],
		  tasks: ["js"]
		},
		buildHtml: {
		  files: ["src/components/static/draw-chem-editor.html"],
		  tasks: ["html"]
		},
		buildCss: {
		  files: ["src/components/static/draw-chem-editor.sass"],
		  tasks: ["css"]
		}
	},
	concat: {
		buildJs: {
			src: [
				"src/angular-draw-chem-app.js",
				"src/components/*/*.js",
				"!src/components/*/*-test.js"
			],
			dest: "src/components/angular-draw-chem.js"
		}
	},
	copy: {
		buildJs: {
			files: [
				{ expand: true, cwd: "src/components/", src: "angular-draw-chem.js", dest: "dest/" }				
			]
		},
		buildHtml: {
			files: [
				{ expand: true, cwd: "src/components/static/", src: "draw-chem-editor.html", dest: "dest/" },
				{ expand: true, cwd: "src/components/static/", src: "draw-chem-editor.html", dest: "tests/assets" }
			]
		},
		buildCss: {
			files: [
				{ expand: true, cwd: "src/components/static/", src: "draw-chem-editor.css", dest: "dest/" }
			]
		}
	},
    uglify: {
		buildJs: {
			files: {
				"dest/angular-draw-chem.min.js": "src/components/angular-draw-chem.js"
			}	
		}
    },
	clean: {
		buildJs: ["src/components/angular-draw-chem.js"],
		buildCss: ["src/components/static/draw-chem-editor.css"]
	},
	sass: {
		buildCss: {
			files: {
				"src/components/static/draw-chem-editor.css": "src/components/static/draw-chem-editor.sass"
			}
		}
	},
	cssmin: {
		buildCss: {
			files: {
				"dest/draw-chem-editor.min.css": "src/components/static/draw-chem-editor.css"
			}
		}
	}
  });
  
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  
  grunt.registerTask("js", ["concat:buildJs", "copy:buildJs", "uglify:buildJs", "clean:buildJs"]);
  grunt.registerTask("css", ["sass:buildCss", "copy:buildCss", "cssmin:buildCss", "clean:buildCss"]);
  grunt.registerTask("html", ["copy:buildHtml"]);
  //grunt.registerTask("default", ["watch"]);
};