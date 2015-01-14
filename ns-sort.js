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

var summary = path.join(pth, 'SUMMARY.md');
if (!fs.existsSync(summary)) {
  console.log('Summary not exist. Abort.');
  process.exit(1);
}

var summaryContent = fs.readFileSync(summary, { encoding: 'UTF-8' });
var lines = summaryContent.split('\r\n').slice(3);

sortedLines = lines.slice().sort(function(a, b) {
  var regex = /[\*\[\]\"\(\)]/g;
  a = a.replace(regex, '');
  b = b.replace(regex, '');
  
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
});

var things = lines.map(function(line, pos) {
  if (line) {
    return {
      name: line,
      oldPos: pos + 1,
      newPos: sortedLines.indexOf(line) + 1
    };
  }
});

async.each(things, moveToNewPath, function(err) {
  if (err) { return console.error(err); }
  async.each(things, renameToOldName, function(err) {
    if (err) { return console.error(err); }

    sortedLines = sortedLines.map(function(thing, pos) {
      return thing.replace(/thing_\d+/, 'thing_' + ('0' + (pos + 1)).slice(-2));
    });

    var sortedSummary = summaryContent.split('\r\n').slice(0, 3).concat(sortedLines).join('\r\n');
    fs.writeFileSync(summary, sortedSummary);
    console.log('Sort completed!');
  });
});

function moveToNewPath(thing, callback) {
  var oldPath = path.join(pth, 'thing_' + ('0' + thing.oldPos).slice(-2), 'README.md');
  var newPath = path.join(pth, 'thing_' + ('0' + thing.newPos).slice(-2), 'README.md_');
  fs.rename(oldPath, newPath, callback);
}

function renameToOldName(thing, callback) {
  var oldPath = path.join(pth, 'thing_' + ('0' + thing.oldPos).slice(-2), 'README.md_');
  var newPath = oldPath.slice(0, -1);
  fs.rename(oldPath, newPath, callback);
}
