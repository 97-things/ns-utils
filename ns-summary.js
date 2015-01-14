#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
var async = require('async');

program.parse(process.argv);

var args = program.args;
var pth = path.resolve(args.length ? args[0] : '');

console.log('Path: ' + pth);

if (!fs.existsSync(pth)) {
  console.log('Path not exist. Abort.');
  process.exit(1);
}

var summaryPath = path.join(pth, 'SUMMARY.md');
fs.writeFileSync(summaryPath, '# Summary\r\n\r\n* [Introduction](README.md)\r\n');

var folders = fs.readdirSync(pth).filter(function(file) {
  return fs.statSync(path.join(pth, file)).isDirectory();
});

var things = [];
folders.forEach(function(folder) {
  var readme = path.join(pth, folder, 'README.md');
  var thingName = '';
  if (fs.existsSync(readme)) {
    var fileContent = fs.readFileSync(readme, { encoding: 'UTF-8' });
    var lines = fileContent.split('\r\n');
    if (lines.length) {
      thingName = lines[0].replace('#', '').trim();
      things.push('* [{thingName}]({url}/README.md)'
        .replace('{thingName}', thingName).replace('{url}', folder));
      process.stdout.write('.');
    }
  }
});
things.length && fs.appendFileSync(path.join(pth, 'SUMMARY.md'), things.join('\r\n'));

console.log('Creating SUMMARY completed!');