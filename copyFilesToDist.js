const fs = require("fs-extra");
const path = require("path");
const { glob } = require("glob");

const types = ["scss"];
const srcDir = "src";
const targetDir = "dist";

const run = async type => {
  const files = await glob(`${srcDir}/**/*.${type}`);
  for (const file of files) {
    const dir = path.dirname(file.replace(srcDir, targetDir));
    fs.ensureDir(dir, error => {
      if (error) {
        throw new Error(`Error creating directory: ${dir} ${error}`);
      }
      // Copy files to build directory.
      const target = path.join(dir, path.basename(file));
      fs.copyFile(file, target, error => {
        if (error) {
          throw new Error(`Error copying file: ${file} ${error}`);
        }
        console.log(`${type} file copied: ${file} -> ${target}`);
      });
    });
  }
};

Promise.all(types.map(run)).catch(console.error);
