#!/usr/bin/env node

var program = require('commander');
var prompt = require('prompt');


program
  .version('0.1.0')
  .command('init [path]', 'create 97 things folders with empty README.md')
  .command('summary [path]', 'generate SUMMARY.md from things folders with README.md')
  .command('sort [path]', 'sort things by alphabetical')
  .parse(process.argv);
