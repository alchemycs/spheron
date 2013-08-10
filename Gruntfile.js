/* jshint node:true */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    jshint:{
      options:{
        node:true,
        unused:true,
        bitwise:false,
        curly:true,
        eqeqeq:true,
        forin:true,
        noarg:true,
        noempty:true,
        nonew:true,
        undef:true,
        strict:false
      },
      grunt:{
        src:['Gruntfile.js']
      },
      lib:{
        src:['lib/**/*.js']
      },
      tests:{
        src:['tests/**/*.js']
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};