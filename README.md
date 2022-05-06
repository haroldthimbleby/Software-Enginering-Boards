# All data and files for the paper "Maturing the computational sciences"

## Harold Thimbleby

## [harold@thimbleby.net](mailto:harold@thimbleby.net)

### 5 May 2022

## Basics

A PDF of the typeset paper and appendix is available at [`http://www.harold.thimbleby.net/reliable-models.pdf`](http://www.harold.thimbleby.net/reliable-models.pdf). It's also available in this repository.

All data is defined and stored in human-readable JSON format in the file `data.js`

For convenience, a CSV file is included in this Git repository. This may be more convenient to read than the JSON file.

Everything works using `make`.

## Overview

First, here's a quick overview of how the system works behind the scenes inside `make`.

To generate all data or typeset the paper, you will need a Unix system with: awk, bibtex, latex, make, node, sed, and zip (plus the usual rm, echo, etc). 

The file `data.js` includes both the JSON data and a JavaScript program that checks the data, analyses it, and generates most of the various data files &mdash; the CSV file, lots of LaTeX files used in the paper, and others.

Running `node data.js` will give you

>       allData.csv - for accessing data in Excel and many other apps
>       flagData.nb - for accessing data in Mathematica notebook
>       data-check.html - a summary of papers and DOIs with any error messages (eg missing data), for easy review in a browser
>       some shell scripts used to run Git to download clones of the survey papers' code repositories
>    ... etc etc, plus a few tex files for including data in the Latex files
 
It also lists all the files generated and their purpose. 

However, it's better to use `make` than do things piecemeal ...

## Using make

Run `make` (with no parameters) to find out everything that you can do. 

Here are all the available options:


* `make all`

    Analyze the data, then typeset the two main PDF files, paper-seb-main.pdf (main paper), and paper-seb-supplementary-material.pdf (appendix) 

* `make archive`

    Clean up all files (by doing `make really-tidyup`) that can easily be re-created, then make a compact zip archive

* `make check-same`

    After you have done a `make data` or `make pdf`, you can check whether you have reproduced all data and generated files exactly the same (more precisely, it checks that they are the same as they were the last time `make check-update` was run)

* `make check-update`

    Update the data and generated file checksums after a successful run

* `make check-versions`

    Check that you have the right software and software versions to run everything

* `make data`

    Analyze the data, and generate all the data files, the Unix scripts, the CSV, and Latex files, etc. This basically runs data.js and then downloads the Git repositories used in the pilot survey. Note that downloading and analyzing the repositories needs decent internet bandwidth, and will take quite a bit of time

* `make expand`

    Expand all Latex files (to recursively flatten `input` files etc) to meet Latex processing restrictions for journals like *PLOS* and *IEEE Transactions on Software Engineering*, then make new PDFs to upload

* `make help`

    (Or just say `make` with no options.) Explain how to use `make`, and list all available options for using `make`

* `make help-brief`

    Just this basic list of `make` options, with no further details

* `make one-file`

    Make a single PDF file paper-seb.pdf (i.e., paper + appendix) all in one

* `make pdf`

    Assuming you have got the data ready, make the two main PDF files, paper-seb-main.pdf (main paper), and paper-seb-supplementary-material.pdf (appendix). If you aren't sure you've got the data ready, say `make all` instead, or `make data` to just prepare the data then do `make pdf`

* `make push`

    Push any changed files to Github, along with the PDF files

* `make readme`

    Update the README.md file. You only need to do this if you've edited the makefile and changed the make options available. (README.md is written in markdown wth Github formats so you know how to do everything on the repository.) 

* `make really-tidyup`

    More thorough than `make tidyup` &mdash; remove *all* files that can be recreated

* `make tidyup`

    Remove all easily generated files, except the main PDFs and the large Github repositories needed for the pilot survey

* `make zip`

    Make a zip archive of everything currently in the directory (except any zip files). You may want to `make tidyup` first

* `make zip-data`

    Just make a zip archive of the data only (as required for, e.g., uploading to a Dryad repository &mdash; which is quirky as it won't include all the code needed to handle the data!)
        
## Further information

For help or further information, please email [harold@thimbleby.net](mailto:harold@thimbleby.net)

Web site [harold.thimbleby.net](http://www.harold.thimbleby.net)
