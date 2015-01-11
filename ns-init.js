#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
var prompt = require('prompt');
var async = require('async');

prompt.message = prompt.delimiter = '';
var yesNoPromptInfo = {
  description: 'y/n',
  pattern: /[y|n]/,
  message: 'Enter "y" or "n"'
};

program.parse(process.argv);

var args = program.args;
var initPath = path.resolve(args.length ? args[0] : '');

console.log('Path: ' + initPath);

if (!fs.existsSync(initPath)) {
  console.log('Path not exist. Create directory? (Yes/No)');
  prompt.get(yesNoPromptInfo, function(err, result) {
    if (result.question === 'n') {
      console.log('Init aborted.');
      process.exit(0);
    }
    fs.mkdirSync(initPath);
    init();
  });
} else {
  init();
}

function init() {
  var dirs = new Array(97).join().split(',')
    .map(function(x, pos) { return path.join(initPath, 'thing_' + ('0' + (pos + 1)).slice(-2)); });
  
  createReadme(initPath);
  async.each(dirs, createFolder, function(err) {
    if (err) { return console.error(err); }
    console.log('Init completed!');
  });
}

function createFolder(pth, callback) {
  if (!fs.existsSync(pth)) {
    fs.mkdir(pth, function(err) {
      if (err) { return callback(err); }
      createReadme(pth, callback);
    });
  } else {
    createReadme(pth, callback);
  }
}

function createReadme(pth, callback) {
  var filePath = path.join(pth, 'README.md');
  if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, '', function(err) {
      if (err) { return callback(err); }
      process.stdout.write('.');
      callback && callback();
    });
  } else {
    callback && callback();
  }
}