# All data and files for the paper "Maturing the computational sciences"

## Harold Thimbleby

## [harold@thimbleby.net](mailto:harold@thimbleby.net)

### 2 May 2022

A PDF of the typeset paper is available at [reliable-models.pdf](http://www.harold.thimbleby.net/reliable-models.pdf)

To generate all data or typeset the paper, you will need a Unix system with make, node, latex and bibtex. For convenience, a CSV file is included in this repository which you could re-generate yourself from the master JSON data if you have `node` or some other way of running the JavaScript file `data.js`).

All data is defined and stored in human-readable JSON format in the file `data.js`

`data.js` also includes a JavaScript program that checks the JSON data, analyses it and generates various files.

If you just want all the data in various formats, please run `node data.js`

this will give you

>       allData.csv - for accessing data in Excel and many other apps
>       flagData.nb - for accessing data in Mathematica notebook
>       data-check.html - a summary of papers and DOIs with any error messages (eg missing data), for easy review in a browser
>    ...plus a few tex files for including data in Latex files
 
It will also list all files generated and their purpose. Note that it also generates some shell scripts that are used to run Git to download clones of some papers' programs, and then the shell script does a simple line count etc of the repositories.

## Using make

The makefile will do everything for you. 

Run `make` (or `make help`) to find out what you can do.

For example, `make config` will tell you what software you need to run everything.

Run `make help` to see everything that you can do
        
## Further information

For help or further information, please email [harold@thimbleby.net](mailto:harold@thimbleby.net)

Web site [harold.thimbleby.net](http://www.harold.thimbleby.net)


