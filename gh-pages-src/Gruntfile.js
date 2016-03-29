module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
  	watch: {
  		html: {
  			files: ["src/*/*.html", "index.html"],
  			tasks: ["copy:html"]
  		},
  		sass: {
  			files: ["src/sass/*.sass"],
  			tasks: ["sass:ghPages", "cssmin:ghPages", "clean:css"]
  		},
  		app: {
  			files: ["src/*.js", "src/*/*.js", "!src/*/*-test.js"],
  			tasks: ["concat:app", "copy:app", "clean:app"]
  		},
  		drawChemJs: {
  			files: ["../dest/js/angular-draw-chem.js"],
  			tasks: ["copy:drawChemJs"]
  		},
  		drawChemHtml: {
  			files: ["../dest/html/*.html"],
  			tasks: ["copy:drawChemHtml"]
  		},
  		drawChemSvg: {
  			files: ["../dest/svg/*.svg"],
  			tasks: ["copy:drawChemSvg"]
  		},
  		drawChemCss: {
  			files: ["../dest/css/*.min.css"],
  			tasks: ["copy:drawChemCss"]
  		}
  	},
  	sass: {
  		ghPages: {
  			files: {
  				"main.css": "src/sass/main.sass"
  			}
  		}
  	},
  	cssmin: {
  		ghPages: {
  			files: {
  				"../gh-pages/stylesheets/main.min.css": "main.css"
  			}
  		}
  	},
  	copy: {
      app: {
  			files: [
  				{ expand: true, cwd: "src/", src: "app-concat.js", dest: "../gh-pages/javascripts/" }
  			]
  		},
  		html: {
  			files: [
  				{ expand: true, cwd: "src/", src: "*/*.html", dest: "../gh-pages/components/" },
  				{ expand: true, cwd: "", src: "index.html", dest: "../gh-pages/" }
  			]
  		},
  		drawChemJs: {
  			files: [
  				{ expand: true, cwd: "../dest/js/", src: "angular-draw-chem.js", dest: "../gh-pages/javascripts/" },
  				{ expand: true, cwd: "../dest/js/", src: "angular-draw-chem.min.js", dest: "../gh-pages-src/tests/assets/" }
  			]
  		},
  		drawChemCss: {
  			files: [
  				{ expand: true, cwd: "../dest/css/", src: "*.min.css", dest: "../gh-pages/stylesheets/" }
  			]
  		},
  		drawChemHtml: {
  			files: [
  				{ expand: true, cwd: "../dest/html/", src: "*.html", dest: "../gh-pages/draw-chem-editor/" }
  			]
  		},
  		drawChemSvg: {
  			files: [
  				{ expand: true, cwd: "../dest/svg/", src: "*.svg", dest: "../gh-pages/draw-chem-editor/svg/" }
  			]
  		}
  	},
  	concat: {
  		app: {
  			src: [
  				"src/*.js",
  				"src/*/*.js",
  				"!src/*/*-test.js"
  			],
  			dest: "src/app-concat.js"
  		}
  	},
    uglify: {
  	  app: {
    		files: {
    			"../gh-pages/javascripts/app.min.js": "src/app-concat.js"
    		}
	    }
    },
	  clean: {
		  app: ["src/app-concat.js"],
		  css: ["main.css"]
	  }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-sass");

  grunt.registerTask("default", ["sass", "cssmin", "copy", "concat", "uglify", "clean"]);
};
