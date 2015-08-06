# gulp-context

Context tasks for gulp

## Description

Organize the structure of gulp tasks by context.
Provides sorting tasks, separation of files and folders, and fully configurable and customizable.

## Dependencies

This package use gulp ^3.9.0 and require global installation.

```
$ npm install gulp -g
```

## Installation

```
$ npm install gulp-context --save-dev
```

## Configuration

### Contexts

A context is the build configuration with specific tasks.
Context must have a name, tasks and can be configured to be dependent on other context.

Supported configurations:

Name | Definition
------------ | -------------
default: boolean | If the context is default
clean: boolean | If the target-dir context must be cleaned before performing other tasks
watch: boolean | Enable/Disable watch files
from-target-context: string | Name of context dependent
task-dir: string | Path to the folder the task files
task: object | Tasks configuration

### Tasks

A task must be parameterized in the context and can be dependent on other tasks.

###### Configuration

The name of the task must match the file name.

```
...
"task-dir": "tasks/development"
"task": {
	"copy/html"
}
```

In this example, the context will search for the file tasks in: _tasks/development/copy/html.js_

###### Dependencies

Dependent tasks only start after the dependent task is completed.

```
...
"task-dir": "tasks/production"
"task": {
	"copy/html": true,
    "minify/html": 'copy/html'
}
```

To declare a list of dependencies, use string array. example: ['copy/html', 'minify/html']

###### File

It must be exposed by __module.exports__.

The scope of the task (___this___) receives the parsed _scope_ configuration.

```javascript
// tasks/production/minify/html.js
var gulp = require('gulp');
    , minifyHtml = require('gulp-minify-html');

module.exports = function () {

    var input = this.input(this.sourceDir, ['**/*.html']);

    return gulp.src(input)
        .pipe(minifyHtml())
        .pipe(gulp.dest(this.targetDir));
}

```

## Usage

#### Set in gulpfile.js

```javascript
var conf = require('./conf.json')
    , gulpc = require('gulp-context');

gulpc.build(conf);
```

#### Create a conf.json like this

```json
{
    "scope": {
        "source-dir": "app/source/",
        "target-dir": "app/build/",
    },
    "context": {
        "development": {
            "default": true,
            "clean": true,
            "watch": true,
            "task-dir": "tasks/development",
            "task": {
                "copy/html": true
            }
        },
        "production": {
        	"clean": true,
            "from-target-context": "development",
            "task-dir": "tasks/production",
            "task": {
                "minify/html": true
            }
        }
    }
}

```

#### Create tasks files

```javascript
// tasks/development/copy/html.js
module.exports = function () {
	...
    return gulp.src(input)
        .pipe(gulp.dest(this.targetDir));
}

// tasks/production/minify/html.js
module.exports = function () {
	...
	return gulp.src(input)
        .pipe(minifyHtml())
        .pipe(gulp.dest(this.targetDir));
}

```

#### Building

Run by the terminal:

* Default context:
```
$ gulp
```

* Specific context:
```
$ gulp development
```

## API
..
