const shell = require('shelljs');

shell.sed('-i', '', '#!/usr/bin/env node', './dist/index.js');
shell.chmod('+x', './dist/index.js');
