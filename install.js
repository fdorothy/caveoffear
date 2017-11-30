const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

var argv = minimist(process.argv.slice(2));
var installPath = argv['path'] || './build';
if (installPath == null)
  throw "install path not specified, use --path /path/to/install";

function installFile(src) {
  dst = path.join(installPath, src);
  fs.copyFileSync(src, dst);
}

function installDirectory(dir) {
  dstDir = path.join(installPath, dir);
  if (!fs.existsSync(dstDir))
    fs.mkdirSync(dstDir);
  fs.readdirSync(dir).forEach((src) => {
    fname = path.join(dir, src);
    stat = fs.statSync(fname);
    if (stat.isDirectory())
      installDirectory(fname);
    else
      installFile(fname);
  });
}

if (!fs.existsSync(installPath))
  fs.mkdirSync(installPath);

installFile("./index.html");
installDirectory("./dist");
installDirectory("./assets");
