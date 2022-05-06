// Harold Thimbleby, 2020-2022
// Javascript code to expand TeX \input commands

var TeXFiles = ["paper-seb-main.tex", "paper-seb-supplementary-material.tex"];

'use strict';

var fs = require('fs');

function saveFile(fileName, string) {
    fs.open(fileName, 'w', function (err, fd) {
        if (err) {
            if (err.code === 'EEXIST') {
                console.error(fileName + " can't be over-written");
                return;
            }
            console.error("** Some error trying to write " + fileName);
            throw err;
        }
        fs.writeFileSync(fd, string, function (err) {
            if (err) {
                return console.log("** Saving " + fileName + " got error: " + err);
            }
        })
    });
}

function getFile(file) {
	file = file.trim();
    try {
        return fs.readFileSync(file, {encoding:'utf8', flag:'r'});
    } catch (err) {
        console.log("** Can't read file " + file + " - " + err);
        return "\\error couldn't read " + file + "\n";
    }
}

var re = RegExp("\\\\input (.*)\n", "g"), rebib=RegExp("\\\\bibliography{(.*).bib}");

var bufferExpand, bufferInsert, auxfile;

for (var i = 0; i < TeXFiles.length; i++) {
    console.log("Recursively expand all \\input and \\bibliography macro calls in " + TeXFiles[i]);
    auxfile = TeXFiles[i].replace(/.tex/, ".aux");
    console.log("        \\input " + auxfile + " (automatically pre-inserted between \\makeatletter and \\makeatother)");
    bufferExpand = "\\makeatletter\n"+getFile(auxfile) + "\n\\makeatother\n";
    bufferExpand = bufferExpand + getFile(TeXFiles[i]); // puts in buffer
    var replaced;
    do {
        replaced = false;
        bufferExpand = bufferExpand.replace(re, function (match, filename) {
            replaced = true;
            console.log("        \\input " + filename);
            bufferInsert = getFile(filename);
            return "% expand " + filename + "\n" + bufferInsert + "% end expanding " + filename + "\n";
        });
        bufferExpand = bufferExpand.replace(rebib, function (match, filename) {
        	replaced = true;
            console.log("      * \\bibliography{"+filename+".bib} (replaced with " + filename+".bbl)");
            bufferInsert = getFile(filename+".bbl");
            return "% expand bibliography " + filename + ".bbl\n" + bufferInsert + "\n% end expanding bibliography " + filename + ".bbl\n";
        });
    }
    while (replaced);
    saveFile("expanded-" + TeXFiles[i], bufferExpand);
    console.log("  ->  Saved as: " + "expanded-" + TeXFiles[i] + "\n");
}